// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const localDomain = 'api-local.stg-branch.be';

const lines = fs.readFileSync('/etc/hosts');

const red = (strs, ...values) => {
  return `\x1b[31m${strs.join('')}\x1b[0m`;
};

if (!lines.includes(localDomain)) {
  fs.writeFileSync(
    '/etc/hosts',
    lines.toString() + `\n127.0.0.1     ${localDomain}`,
  );
  console.log(red`hosts 추가 완료`);
} else {
  console.log(red`이미 hosts 에 추가되어있음`);
}
