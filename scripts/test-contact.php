<?php
declare(strict_types=1);
require __DIR__ . '/../server/contact.php';
function check(bool $ok, string $message): void { if (!$ok) throw new RuntimeException($message); }
$valid=['nombre'=>'Prueba técnica','email'=>'visitor@example.com','telefono'=>'11 1234 5678','tipo'=>'Piso','mensaje'=>'Consulta de prueba.','website_confirmation'=>''];
$fields=mc_contact_fields($valid);
check($fields['email']==='visitor@example.com','Valid submission');
foreach ([['email'=>"visitor@example.com\r\nBcc: other@example.com"],['nombre'=>"Prueba\nBcc: other@example.com"],['email'=>'bad'],['website_confirmation'=>'spam'],['mensaje'=>''],['mensaje'=>str_repeat('a',3001)],['tipo'=>'invalid'],['nombre'=>[]]] as $change) {
    $rejected=false; try {mc_contact_fields(array_replace($valid,$change));} catch (InvalidArgumentException $e) {$rejected=true;}
    check($rejected,'Invalid or injected submission must be rejected');
}
$dir=sys_get_temp_dir().'/mc-contact-test-'.bin2hex(random_bytes(8));mkdir($dir,0700);
try {
    for($i=0;$i<3;$i++)check(mc_contact_limit($dir,'test',3,3600,10000),'First three allowed');
    check(!mc_contact_limit($dir,'test',3,3600,10001),'Fourth blocked');
    check(mc_contact_limit($dir,'test',3,3600,13601),'Window expires');
} finally {foreach(glob($dir.'/*') as $file)unlink($file);rmdir($dir);}
check(str_contains(mc_contact_message($fields),'visitor@example.com'),'Reply details included');
echo "Contact validation, header injection rejection, honeypot and rate limits passed. No emails sent.\n";
