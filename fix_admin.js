const fs = require('fs');
let content = fs.readFileSync('admin/index.html', 'utf8');

// Fix labels
content = content.replace(
  /const labels = {([\s\S]*?)};\s+const next/,
  const labels = {
        dashboard: { title: 'Admin Dashboard', subtitle: 'Track donations, review activity, and manage campaigns.' },
        ourwork: { title: 'Our Work Cards', subtitle: 'Manage the 6 initiative cards shown on the home and explore pages.' },
        posters: { title: 'Explore Posters', subtitle: 'Add and edit detailed impact posters for the public Explore page.' },
        donations: { title: 'Donation Center', subtitle: 'Review incoming gifts and verify payment status.' },
        reports: { title: 'Reports', subtitle: 'Monitor campaign performance across your fundraising programs.' },
        donors: { title: 'Donor Management', subtitle: 'Keep donor insights and engagement history in one place.' },
        settings: { title: 'Settings', subtitle: 'Update notification preferences and fundraising controls.' }
      };
      
      const next
);

// Fix innerHTML broken JS
content = content.replace(
  /tr\.innerHTML =\s+<td>\\<\/td>\s+<td><img src="\/\\" alt="\\" style="height: 40px; border-radius: 4px; object-fit: cover;"><\/td>\s+<td>\\<\/td>\s+<td><span class="stat-chip chip-blue">\\<\/span><\/td>\s+<td style="text-align:right">\s+<button class="btn" style="background:#ffca05; color:#000; margin-right: 8px;" onclick="editWork\(\'\\\'\)">Edit<\/button>\s+<button class="btn" style="background:#ff5a5a; color:#fff;" onclick="deleteWork\(\'\\\'\)">Delete<\/button>\s+<\/td>\s+;/,
  "tr.innerHTML = \\n" +
  "      <td></td>\\n" +
  "      <td><img src=\"/\" alt=\"\" style=\"height: 40px; border-radius: 4px; object-fit: cover;\"></td>\\n" +
  "      <td></td>\\n" +
  "      <td><span class=\"stat-chip chip-blue\"></span></td>\\n" +
  "      <td style=\"text-align:right\">\\n" +
  "        <button class=\"btn\" style=\"background:#ffca05; color:#000; margin-right: 8px;\" onclick=\"editWork('')\">Edit</button>\\n" +
  "        <button class=\"btn\" style=\"background:#ff5a5a; color:#fff;\" onclick=\"deleteWork('')\">Delete</button>\\n" +
  "      </td>\\n" +
  "    ;"
);

fs.writeFileSync('admin/index.html', content);
console.log('Fixed admin/index.html');
