// Manual/weekly maintenance: identify a new upstream version; never auto-install code.
import fs from 'node:fs';
const installed=fs.readFileSync('assets/vendor/lenis/README.txt','utf8').match(/^# Lenis (\S+)/)?.[1];
if(!installed)throw Error('Missing pinned Lenis version');
const response=await fetch('https://registry.npmjs.org/lenis/latest',{signal:AbortSignal.timeout(15000)});
if(!response.ok)throw Error('Could not verify upstream version: '+response.status);
const latest=await response.json();
if(latest.version!==installed)throw Error(`Lenis ${latest.version} is available; review and test before updating ${installed}.`);
const security=await fetch('https://api.osv.dev/v1/query',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({package:{name:'lenis',ecosystem:'npm'},version:installed}),signal:AbortSignal.timeout(15000)});
if(!security.ok)throw Error('Could not check advisories: '+security.status);
const result=await security.json();if(result.vulns?.length)throw Error('Review Lenis advisories: '+result.vulns.map(v=>v.id).join(', '));
console.log(`Lenis ${installed}: current stable version; no matching OSV advisories returned.`);
