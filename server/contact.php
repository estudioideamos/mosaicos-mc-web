<?php
declare(strict_types=1);

// Deployed only as /api/contact.php. Mail stays on the client's hosting.
function mc_contact_fields(array $input): array {
    $limits = ['nombre'=>120, 'email'=>200, 'telefono'=>40, 'tipo'=>30, 'mensaje'=>3000, 'website_confirmation'=>200];
    $fields = [];
    foreach ($limits as $name=>$limit) {
        $value = $input[$name] ?? '';
        if (!is_string($value) || !preg_match('//u', $value) || preg_match_all('/./us', $value) > $limit) {
            throw new InvalidArgumentException('Revisá los datos y la extensión de tu consulta.');
        }
        $fields[$name] = trim($value);
    }
    if ($fields['website_confirmation'] !== '' || $fields['nombre'] === '' || $fields['mensaje'] === '') {
        throw new InvalidArgumentException('Revisá los datos de tu consulta.');
    }
    foreach (['nombre','email','telefono','tipo'] as $name) {
        if (preg_match('/[\r\n\x00]/', $fields[$name])) throw new InvalidArgumentException('Revisá los datos ingresados.');
    }
    if (!filter_var($fields['email'], FILTER_VALIDATE_EMAIL) || !in_array($fields['tipo'], ['Piso','Pared','Mosaicos','Otro'], true)) {
        throw new InvalidArgumentException('Ingresá un email válido y seleccioná el tipo de proyecto.');
    }
    if (preg_match_all('~https?://~i', $fields['mensaje']) > 3) throw new InvalidArgumentException('Enviá tu consulta con un máximo de tres enlaces.');
    return $fields;
}

function mc_contact_limit(string $directory, string $key, int $limit, int $seconds, int $now): bool {
    $file = fopen($directory . '/' . hash('sha256', $key) . '.json', 'c+');
    if (!$file || !flock($file, LOCK_EX)) throw new RuntimeException('Rate storage unavailable');
    try {
        $events = json_decode(stream_get_contents($file), true);
        $events = is_array($events) ? array_values(array_filter($events, static fn($t) => is_int($t) && $t > $now - $seconds)) : [];
        if (count($events) >= $limit) return false;
        $events[] = $now; rewind($file); ftruncate($file, 0);
        if (fwrite($file, json_encode($events)) === false) throw new RuntimeException('Rate storage unavailable');
        fflush($file); return true;
    } finally { flock($file, LOCK_UN); fclose($file); }
}

function mc_contact_message(array $fields): string {
    return "Nueva consulta recibida desde mosaicosmc.com\n\nNombre: " . $fields['nombre'] . "\nEmail: " . $fields['email']
        . "\nTeléfono: " . ($fields['telefono'] ?: 'No informado') . "\nTipo de proyecto: " . $fields['tipo'] . "\n\n"
        . $fields['mensaje'] . "\n\nPodés responder este correo para contactar al visitante.\n";
}

function mc_contact_reply(int $status, array $data): void {
    http_response_code($status); echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit;
}

function mc_smtp_read($stream, int $expected): void {
    for ($i=0; $i<40; $i++) {
        $line=fgets($stream, 1024);
        if ($line === false || !preg_match('/^([0-9]{3})([ -])/', $line, $match)) throw new RuntimeException('Mail server did not respond');
        if ((int)$match[1] !== $expected) throw new RuntimeException('Mail server rejected request');
        if ($match[2] === ' ') return;
    }
    throw new RuntimeException('Invalid mail server response');
}

function mc_smtp_write($stream, string $data): void {
    while ($data !== '') {
        $written=fwrite($stream, $data);
        if ($written === false || $written === 0) throw new RuntimeException('Mail connection interrupted');
        $data=substr($data, $written);
    }
}

function mc_contact_mail(array $fields): void {
    // Loopback only: the hosting's own Exim queue, never a third-party service.
    $stream=@stream_socket_client('tcp://127.0.0.1:25', $errno, $error, 4);
    if (!$stream) throw new RuntimeException('Local mail server unavailable');
    stream_set_timeout($stream, 4);
    try {
        mc_smtp_read($stream, 220);
        foreach (['EHLO mosaicosmc.com','MAIL FROM:<info@mosaicosmc.com>','RCPT TO:<info@mosaicosmc.com>'] as $command) {
            mc_smtp_write($stream, $command."\r\n"); mc_smtp_read($stream, 250);
        }
        mc_smtp_write($stream, "DATA\r\n"); mc_smtp_read($stream, 354);
        $headers=['Date: '.gmdate('D, d M Y H:i:s +0000'),
            'Message-ID: <'.bin2hex(random_bytes(16)).'@mosaicosmc.com>',
            'From: Mosaicos MC <info@mosaicosmc.com>', 'To: info@mosaicosmc.com',
            'Reply-To: '.$fields['email'], 'Subject: Nueva consulta desde mosaicosmc.com',
            'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64'];
        mc_smtp_write($stream, implode("\r\n", $headers)."\r\n\r\n".chunk_split(base64_encode(mc_contact_message($fields)),76,"\r\n").".\r\n");
        // Success requires the queue acknowledgement. Never retry an uncertain delivery.
        mc_smtp_read($stream, 250);
        @fwrite($stream, "QUIT\r\n");
    } finally { fclose($stream); }
}

function mc_contact_endpoint(): void {
    ini_set('display_errors', '0');
    header('Content-Type: application/json; charset=utf-8'); header('Cache-Control: no-store, private');
    header('X-Content-Type-Options: nosniff'); header('X-Robots-Tag: noindex, nofollow');
    $method = $_SERVER['REQUEST_METHOD'] ?? '';
    if (!in_array($method, ['GET','POST'], true)) { header('Allow: GET, POST'); mc_contact_reply(405, ['ok'=>false,'message'=>'Método no permitido.']); }
    if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] !== 'https://mosaicosmc.com') mc_contact_reply(403, ['ok'=>false,'message'=>'Abrí el formulario desde mosaicosmc.com.']);
    if (($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site') mc_contact_reply(403, ['ok'=>false,'message'=>'Abrí el formulario desde mosaicosmc.com.']);
    ini_set('session.use_strict_mode', '1'); ini_set('session.use_only_cookies', '1');
    session_name('mc_contact_session');
    session_set_cookie_params(['lifetime'=>0,'path'=>'/api/','secure'=>true,'httponly'=>true,'samesite'=>'Strict']);
    if (!session_start()) mc_contact_reply(503, ['ok'=>false,'message'=>'No pudimos iniciar el formulario. Intentá nuevamente.']);
    $now = time();
    if ($method === 'GET') {
        if (!isset($_SESSION['token'], $_SESSION['issued']) || $now - $_SESSION['issued'] > 1800) {
            $_SESSION['token'] = bin2hex(random_bytes(32)); $_SESSION['issued'] = $now;
        }
        mc_contact_reply(200, ['ok'=>true,'token'=>$_SESSION['token'],'wait'=>max(0, 3 - ($now - $_SESSION['issued']))]);
    }
    if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) mc_contact_reply(415, ['ok'=>false,'message'=>'Formato no admitido.']);
    $body = file_get_contents('php://input', false, null, 0, 16385);
    if ($body === false || strlen($body) > 16384) mc_contact_reply(413, ['ok'=>false,'message'=>'La consulta es demasiado extensa.']);
    $data = json_decode($body, true);
    if (!is_array($data)) mc_contact_reply(400, ['ok'=>false,'message'=>'Revisá tu consulta.']);
    if (!is_string($data['token'] ?? null) || !isset($_SESSION['token'], $_SESSION['issued']) || !hash_equals($_SESSION['token'], $data['token']) || $now - $_SESSION['issued'] > 1800) mc_contact_reply(403, ['ok'=>false,'message'=>'El formulario venció. Volvé a intentarlo.']);
    if ($now - $_SESSION['issued'] < 3) mc_contact_reply(429, ['ok'=>false,'message'=>'Esperá unos segundos y volvé a intentar.']);
    try { $fields = mc_contact_fields($data); }
    catch (InvalidArgumentException $error) { mc_contact_reply(422, ['ok'=>false,'message'=>$error->getMessage()]); }
    try {
        $directory = dirname(__DIR__, 2) . '/_mc_contact_state';
        if (is_link($directory) || (!is_dir($directory) && !mkdir($directory, 0700, true))) throw new RuntimeException('Private storage unavailable');
        $keyFile = $directory . '/secret';
        if (!is_file($keyFile)) {
            $handle = @fopen($keyFile, 'x');
            if ($handle) { fwrite($handle, bin2hex(random_bytes(32))); fclose($handle); chmod($keyFile, 0600); }
        }
        $key = file_get_contents($keyFile);
        if ($key === false || strlen($key) !== 64) throw new RuntimeException('Private key unavailable');
        $ipKey = hash_hmac('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown', $key);
        if (!mc_contact_limit($directory, $ipKey, 3, 3600, $now) || !mc_contact_limit($directory, 'global', 40, 3600, $now)) {
            header('Retry-After: 3600'); mc_contact_reply(429, ['ok'=>false,'message'=>'Llegaste al límite de consultas. Podés contactarnos por WhatsApp o intentar más tarde.']);
        }
        // Never accept user-controlled recipients, sender, subject or envelope sender.
        mc_contact_mail($fields);
        unset($_SESSION['token'], $_SESSION['issued']);
        mc_contact_reply(200, ['ok'=>true,'message'=>'Tu consulta fue enviada. Te responderemos por email.']);
    } catch (Throwable $error) {
        error_log('MC contact: server could not process submission.');
        mc_contact_reply(503, ['ok'=>false,'message'=>'No pudimos enviar la consulta en este momento. Intentá más tarde o escribinos a info@mosaicosmc.com.']);
    }
}

if (PHP_SAPI !== 'cli') mc_contact_endpoint();
