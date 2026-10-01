const fs = require('fs');
let content = fs.readFileSync('admin/index.html', 'utf8');

const replacement = `      const labels = {
        dashboard: { title: 'Admin Dashboard', subtitle: 'Track donations, review activity, and manage campaigns.' },
        ourwork: { title: 'Our Work Cards', subtitle: 'Manage the 6 initiative cards shown on the home and explore pages.' },
        posters: { title: 'Explore Posters', subtitle: 'Add and edit detailed impact posters for the public Explore page.' },
        donations: { title: 'Donation Center', subtitle: 'Review incoming gifts and verify payment status.' },
        reports: { title: 'Reports', subtitle: 'Monitor campaign performance across your fundraising programs.' },
        donors: { title: 'Donor Management', subtitle: 'Keep donor insights and engagement history in one place.' },
        settings: { title: 'Settings', subtitle: 'Update notification preferences and fundraising controls.' }
      };`;

content = content.replace(/const labels = \{[\s\S]*?\};\s*/, replacement + '\n\n');

fs.writeFileSync('admin/index.html', content);
console.log('Fixed labels using regex!');
