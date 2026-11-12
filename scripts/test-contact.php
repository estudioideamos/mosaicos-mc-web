<?php
declare(strict_types=1);
require __DIR__ . '/../server/contact.php';
function check(bool $ok, string $message): void { if (!$ok) throw new RuntimeException($message); }
$valid=['nombre'=>'Prueba técnica','email'=>'visitor@example.com','telefono'=>'11 1234 5678','tipo'=>'Piso','mensaje'=>'Consulta de prueba.','website_confirmation'=>''];
$fields=mc_contact_fields($valid);
check(mc_contact_ip_limit(10000,0)===3,'Normal limit');
check(mc_contact_ip_limit(10000,17200)===20,'Temporary testing limit');
check(mc_contact_ip_limit(17200,17200)===3,'Testing limit expires automatically');
check(mc_contact_ip_limit(10000,17201)===3,'Reject unbounded testing window');
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
foreach (["250 OK\r\n", "250-server\r\n250 SIZE 52428800\r\n"] as $reply) {
    $s=fopen('php://memory','w+');fwrite($s,$reply);rewind($s);mc_smtp_read($s,250);fclose($s);
}
foreach (["550 Rejected\r\n", "invalid\r\n", "", str_repeat("250-more\r\n",41)] as $reply) {
    $s=fopen('php://memory','w+');fwrite($s,$reply);rewind($s);$rejected=false;
    try{mc_smtp_read($s,250);}catch(RuntimeException $e){$rejected=true;}finally{fclose($s);}
    check($rejected,'SMTP failures must not report success');
}
$s=fopen('php://memory','w+');mc_smtp_write($s,"EHLO mosaicosmc.com\r\n");rewind($s);check(stream_get_contents($s)==="EHLO mosaicosmc.com\r\n",'Complete SMTP write');fclose($s);
echo "Contact validation, header injection rejection, honeypot and rate limits passed. No emails sent.\n";
