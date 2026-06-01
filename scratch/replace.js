const fs = require('fs');
const file = 'components/team-registration-form.tsx';
let c = fs.readFileSync(file, 'utf8');
const s = <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'var(--bg-muted)', padding: '16px', borderRadius: '8px' }}>\n            <div>;
const r = <div style={{ background: 'var(--bg-muted)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>\n            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>\n              📸 Please take a picture of the details below!\n            </div>\n            <div style={{ color: 'var(--ink-50)', fontSize: '0.9rem' }}>\n              Page will automatically refresh for the next user in <strong>{countdown}</strong> seconds.\n            </div>\n          </div>\n          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'var(--bg-muted)', padding: '16px', borderRadius: '8px' }}>\n            <div>;
if(c.includes(s)) {
    c = c.replace(s, r);
    fs.writeFileSync(file, c);
    console.log('Replaced successfully');
} else {
    console.log('Target string not found!');
}
