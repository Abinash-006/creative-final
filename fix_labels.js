const fs = require('fs');
let content = fs.readFileSync('admin/index.html', 'utf8');

const targetStr = `        dashboard: { title: 'Admin Dashboard', subtitle: 'Track donations, review activity, and manage campaigns.' },
        donations: { title: 'Donation Center', subtitle: 'Review incoming gifts and verify payment status.' },`;

const replaceStr = `        dashboard: { title: 'Admin Dashboard', subtitle: 'Track donations, review activity, and manage campaigns.' },
        ourwork: { title: 'Our Work Cards', subtitle: 'Manage the 6 initiative cards shown on the home and explore pages.' },
        posters: { title: 'Explore Posters', subtitle: 'Add and edit detailed impact posters for the public Explore page.' },
        donations: { title: 'Donation Center', subtitle: 'Review incoming gifts and verify payment status.' },`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replaceStr);
    fs.writeFileSync('admin/index.html', content);
    console.log('Fixed labels!');
} else {
    console.log('Could not find target string in labels.');
}
