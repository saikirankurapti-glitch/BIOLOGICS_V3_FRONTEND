let allReports = [];

document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.getElementById('registry-table-body');
    const filterSelect = document.getElementById('report-filter');
    
    try {
        const res = await fetch('/api/reports/list');
        if (res.ok) {
            allReports = await res.json();
            renderTable(allReports);
            
            if (filterSelect) {
                filterSelect.addEventListener('change', (e) => {
                    const filterVal = e.target.value;
                    if (filterVal === 'All') {
                        renderTable(allReports);
                    } else {
                        renderTable(allReports.filter(r => r.report_type === filterVal));
                    }
                });
            }
        } else {
            throw new Error('Failed to fetch registry');
        }
    } catch (e) {
        console.error(e);
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 2rem; color: #ef4444;">Error loading registry.</td></tr>`;
    }
});

function renderTable(reports) {
    const tableBody = document.getElementById('registry-table-body');
    if (reports.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: #64748b;">No saved reports found for this filter.</td></tr>';
    } else {
        tableBody.innerHTML = reports.map(r => `
            <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 1rem; font-weight: 600; color: #115e59;">
                    <i class="fas fa-file-pdf" style="color: #ef4444; margin-right: 0.5rem;"></i>
                    ${r.report_type}
                </td>
                <td style="padding: 1rem;">${r.target_name || r.target_id || 'Unknown'}</td>
                <td style="padding: 1rem;">${new Date(r.created_at.endsWith('Z') ? r.created_at : r.created_at + 'Z').toLocaleString()}</td>
                <td style="padding: 1rem;">
                    <button onclick="downloadRegistryReport('${r._id || r.id}')" style="background: #10b981; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">
                        <i class="fas fa-download"></i> Download
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

async function downloadRegistryReport(reportId) {
    try {
        const res = await fetch(`/api/reports/download/${reportId}`);
        if (!res.ok) {
            alert('Failed to download report.');
            return;
        }
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Saved_Report_${reportId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (e) {
        console.error(e);
        alert('Error downloading report.');
    }
}
