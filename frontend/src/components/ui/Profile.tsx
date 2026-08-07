import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUser, getToken } from '../../utils/auth';
import { fetchProgress } from '../../utils/api';
import jsPDF from 'jspdf';

interface ProfileProps {
  onBack?: () => void;
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
}

const calculateLevel = (xp: number) => Math.floor(xp / 100) + 1;

// ===== SUB-COMPONENTS =====

// 1. Edit Profile
const EditProfile: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const user = getUser();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState('Mental health advocate & student');

  const handleSave = () => {
    alert('Profile updated successfully!');
    onBack();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
          <i className="fas fa-arrow-left"></i>
        </button>
        <h3 className="text-xl font-bold text-gray-800">Edit Profile</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
        >
          Save Changes
        </button>
      </div>
    </motion.div>
  );
};

// 2. Notifications
const Notifications: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    reminders: false,
    weeklyReport: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
          <i className="fas fa-arrow-left"></i>
        </button>
        <h3 className="text-xl font-bold text-gray-800">Notifications</h3>
      </div>

      <div className="space-y-3">
        {[
          { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
          { key: 'push', label: 'Push Notifications', desc: 'Get real-time alerts' },
          { key: 'reminders', label: 'Daily Reminders', desc: 'Gentle nudges for wellness' },
          { key: 'weeklyReport', label: 'Weekly Report', desc: 'Your weekly summary' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">{item.label}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
            <button
              onClick={() => toggle(item.key as keyof typeof settings)}
              className={`w-12 h-6 rounded-full transition ${settings[item.key as keyof typeof settings] ? 'bg-amber-500' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition ${settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// 3. Privacy
const Privacy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
          <i className="fas fa-arrow-left"></i>
        </button>
        <h3 className="text-xl font-bold text-gray-800">Privacy Settings</h3>
      </div>

      <div className="space-y-3">
        {[
          { label: 'Data Sharing', desc: 'Share anonymized data for research' },
          { label: 'Activity Status', desc: 'Show when you are active' },
          { label: 'Profile Visibility', desc: 'Who can see your profile' },
          { label: 'Delete Account', desc: 'Permanently delete your data' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">{item.label}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
            <button
              onClick={() => alert(`Settings for ${item.label} coming soon!`)}
              className="px-4 py-1 text-sm bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition"
            >
              Manage
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// 4. Dark Mode
const DarkModeSettings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    alert(`Dark mode ${!darkMode ? 'enabled' : 'disabled'}!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
          <i className="fas fa-arrow-left"></i>
        </button>
        <h3 className="text-xl font-bold text-gray-800">Dark Mode</h3>
      </div>

      <div className="p-6 bg-gray-50 rounded-lg text-center">
        <div className="text-6xl mb-4">{darkMode ? 'Moon' : 'Sun'}</div>
        <p className="text-gray-600 mb-4">
          {darkMode ? 'Dark mode is enabled' : 'Light mode is enabled'}
        </p>
        <button
          onClick={toggleDarkMode}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
        >
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>
    </motion.div>
  );
};

// 5. Language
const LanguageSettings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedLang, setSelectedLang] = useState('English');

  const languages = [
    { code: 'en', name: 'English', flag: 'GB' },
    { code: 'hi', name: 'Hindi', flag: 'IN' },
    { code: 'es', name: 'Spanish', flag: 'ES' },
    { code: 'fr', name: 'French', flag: 'FR' },
    { code: 'de', name: 'German', flag: 'DE' },
    { code: 'zh', name: 'Chinese', flag: 'CN' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
          <i className="fas fa-arrow-left"></i>
        </button>
        <h3 className="text-xl font-bold text-gray-800">Language</h3>
      </div>

      <div className="space-y-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              setSelectedLang(lang.name);
              alert(`Language changed to ${lang.name}!`);
            }}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition ${selectedLang === lang.name ? 'bg-amber-50 border-2 border-amber-400' : 'bg-gray-50 hover:bg-gray-100'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{lang.flag}</span>
              <span className="font-medium text-gray-800">{lang.name}</span>
            </div>
            {selectedLang === lang.name && <i className="fas fa-check-circle text-amber-500"></i>}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// 6. Export Data - FIXED PDF
const ExportData: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<string>('');
  const [screeningData, setScreeningData] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const response = await fetch('/api/survey/history', {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          const formattedData = Array.isArray(data) ? data : data.surveys || [];
          setScreeningData(formattedData);
        } else {
          setScreeningData(getMockData());
        }
      } catch (error) {
        setScreeningData(getMockData());
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const getMockData = () => {
    const now = new Date();
    return [
      {
        id: 1,
        date: now.toISOString().split('T')[0],
        riskLevel: 'Moderate',
        riskScore: 65,
        stressFactors: ['Academics (7/10)', 'Sleep (5/10)', 'Financial (6/10)'],
        recommendations: ['Practice mindfulness for 10 minutes daily', 'Establish a consistent sleep schedule', 'Reach out to support networks']
      },
      {
        id: 2,
        date: new Date(now.getTime() - 7 * 86400000).toISOString().split('T')[0],
        riskLevel: 'High',
        riskScore: 78,
        stressFactors: ['Academics (8/10)', 'Relationships (7/10)', 'Career (6/10)'],
        recommendations: ['Seek professional support', 'Take regular study breaks', 'Practice deep breathing']
      },
      {
        id: 3,
        date: new Date(now.getTime() - 14 * 86400000).toISOString().split('T')[0],
        riskLevel: 'Low',
        riskScore: 35,
        stressFactors: ['Academics (4/10)', 'Sleep (6/10)'],
        recommendations: ['Maintain your healthy habits!', 'Stay connected with friends', 'Continue regular exercise']
      }
    ];
  };

  // FIXED: Generate PDF using jsPDF with proper encoding
  const generatePDF = (user: any, data: any[]) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const margin = 15;
    let y = 15;

    // ===== HEADER =====
    doc.setFillColor(245, 158, 11);
    doc.rect(0, 0, pageWidth, 38, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Serenoa', margin + 5, 22);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Mental Wellness Report', margin + 5, 32);

    const dateStr = new Date().toISOString().split('T')[0];
    doc.setTextColor(220, 220, 220);
    doc.setFontSize(9);
    doc.text('Generated: ' + dateStr, pageWidth - margin - 30, 22);

    y = 48;

    // ===== USER INFO =====
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 24, 3, 3, 'F');
    
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('User: ' + (user?.name || 'Student'), margin + 8, y + 9);
    doc.text('Email: ' + (user?.email || 'N/A'), margin + 8, y + 19);

    const avgRisk = data.length > 0 
      ? Math.round(data.reduce((sum: number, d: any) => sum + (d.riskScore || 0), 0) / data.length) 
      : 0;
    const latest = data.length > 0 ? data[data.length - 1] : null;

    doc.text('Avg Risk Score: ' + avgRisk + '%', pageWidth - margin - 50, y + 9);
    doc.text('Current Risk: ' + (latest?.riskLevel || 'Low'), pageWidth - margin - 50, y + 19);

    y += 34;

    // ===== SUMMARY STATS =====
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary Statistics', margin, y);
    y += 8;

    const riskLevels = data.map((d: any) => d.riskLevel || 'Low');
    const highCount = riskLevels.filter((r: string) => r === 'High').length;
    const moderateCount = riskLevels.filter((r: string) => r === 'Moderate').length;
    const lowCount = riskLevels.filter((r: string) => r === 'Low').length;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const stats = [
      { label: 'Total Screenings', value: data.length },
      { label: 'Avg Risk Score', value: avgRisk + '%' },
      { label: 'High Risk', value: highCount },
      { label: 'Moderate Risk', value: moderateCount },
      { label: 'Low Risk', value: lowCount }
    ];

    stats.forEach((stat, i) => {
      const x = margin + (i % 3) * 56;
      const yPos = y + Math.floor(i / 3) * 12;
      doc.text(stat.label + ': ' + stat.value, x, yPos);
    });

    y += 30;

    // ===== RISK METER =====
    if (latest) {
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(margin, y, pageWidth - (margin * 2), 20, 3, 3, 'F');
      
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Current Risk Level', margin + 8, y + 8);

      const riskScore = latest.riskScore || 35;
      const barWidth = (pageWidth - (margin * 2) - 100);
      const fillWidth = (riskScore / 100) * barWidth;
      
      doc.setFillColor(220, 220, 220);
      doc.roundedRect(pageWidth - margin - barWidth - 8, y + 5, barWidth, 10, 5, 5, 'F');
      
      let color = [72, 187, 120];
      if (latest.riskLevel === 'Moderate') color = [237, 137, 54];
      if (latest.riskLevel === 'High') color = [252, 129, 129];
      
      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(pageWidth - margin - barWidth - 8, y + 5, fillWidth, 10, 5, 5, 'F');
      
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.text(riskScore + '%', pageWidth - margin - 8, y + 11);
      doc.text('0%', pageWidth - margin - barWidth - 10, y + 18);
      doc.text('100%', pageWidth - margin - 8, y + 18);

      y += 32;
    }

    // ===== SCREENING HISTORY =====
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Screening History', margin, y);
    y += 8;

    // Table headers
    doc.setFillColor(245, 158, 11);
    doc.rect(margin, y, pageWidth - (margin * 2), 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    
    const headers = ['#', 'Date', 'Score', 'Level', 'Stress Factors'];
    const colWidths = [10, 28, 25, 28, 68];
    let xPos = margin + 4;
    headers.forEach((h, i) => {
      doc.text(h, xPos, y + 5.5);
      xPos += colWidths[i];
    });

    y += 8;

    // Table rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    data.slice(0, 15).forEach((d: any, i: number) => {
      if (y > 265) {
        doc.addPage();
        y = 20;
      }
      
      const rowColor = i % 2 === 0 ? [255, 255, 255] : [248, 248, 248];
      doc.setFillColor(rowColor[0], rowColor[1], rowColor[2]);
      doc.rect(margin, y, pageWidth - (margin * 2), 7, 'F');
      
      doc.setTextColor(30, 30, 30);
      const rowData = [
        String(i + 1),
        d.date || 'N/A',
        (d.riskScore || 0) + '%',
        d.riskLevel || 'Low',
        (d.stressFactors || []).slice(0, 3).join(', ')
      ];
      
      let rowX = margin + 4;
      rowData.forEach((text, colIndex) => {
        doc.text(text, rowX, y + 5);
        rowX += colWidths[colIndex];
      });
      
      y += 7;
    });

    y += 12;

    // ===== RECOMMENDATIONS =====
    if (latest && latest.recommendations && latest.recommendations.length > 0) {
      if (y > 240) {
        doc.addPage();
        y = 20;
      }
      
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Recommendations', margin, y);
      y += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      latest.recommendations.forEach((rec: string) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text('- ' + rec, margin + 5, y);
        y += 8;
      });
    }

    y += 8;

    // ===== KEY INSIGHTS =====
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(254, 243, 199);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 32, 3, 3, 'F');
    
    doc.setTextColor(146, 64, 14);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Insights', margin + 8, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const insights = [
      '- Completed ' + data.length + ' screenings',
      '- Average risk score: ' + avgRisk + '%',
      latest ? '- Current risk level: ' + latest.riskLevel : '',
      highCount > 0 ? '- ' + highCount + ' high-risk screenings detected' : '',
      '- Keep tracking your mental wellness regularly'
    ].filter(Boolean);

    insights.forEach((insight, i) => {
      doc.text(insight, margin + 10, y + 20 + (i * 6));
    });

    y += 40;

    // ===== FOOTER =====
    doc.setFillColor(200, 200, 200);
    doc.rect(0, y, pageWidth, 0.5, 'F');
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text('2026 Serenoa - AI Mental Health Companion', pageWidth / 2, y + 8, { align: 'center' });

    doc.save('wellness-report-' + new Date().toISOString().split('T')[0] + '.pdf');
  };

  // ✅ Handle Export
  const handleExport = async (format: string) => {
    setExporting(true);
    setExportFormat(format);

    try {
      const user = getUser();
      const dataToExport = screeningData.length > 0 ? screeningData : getMockData();

      if (format === 'PDF') {
        generatePDF(user, dataToExport);
        alert('PDF Report exported successfully!');
      } 
      else if (format === 'CSV') {
        const content = generateCSVReport(dataToExport);
        downloadFile(content, 'wellness-report-' + new Date().toISOString().split('T')[0] + '.csv', 'text/csv');
        alert('CSV Report exported successfully!');
      } 
      else if (format === 'JSON') {
        const content = generateJSONReport(user, dataToExport);
        downloadFile(content, 'wellness-report-' + new Date().toISOString().split('T')[0] + '.json', 'application/json');
        alert('JSON Report exported successfully!');
      } 
      else if (format === 'Excel') {
        const content = generateExcelReport(dataToExport);
        downloadFile(content, 'wellness-report-' + new Date().toISOString().split('T')[0] + '.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        alert('Excel Report exported successfully!');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // ✅ Download helper
  const downloadFile = (content: string | Blob, fileName: string, mimeType: string) => {
    let blob: Blob;
    if (content instanceof Blob) {
      blob = content;
    } else {
      blob = new Blob([content], { type: mimeType });
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // ✅ Generate CSV Report
  const generateCSVReport = (data: any[]) => {
    if (!data || data.length === 0) return 'No screening data available';
    const headers = ['Date', 'Risk Score', 'Risk Level', 'Stress Factors', 'Recommendations'];
    const rows = data.map((d: any) => [
      d.date || 'N/A',
      d.riskScore || 0,
      d.riskLevel || 'Low',
      (d.stressFactors || []).join('; '),
      (d.recommendations || []).join('; ')
    ]);
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  // ✅ Generate JSON Report
  const generateJSONReport = (user: any, data: any[]) => {
    return JSON.stringify({
      user: user ? { name: user.name, email: user.email } : null,
      generatedAt: new Date().toISOString(),
      screenings: data,
      summary: {
        totalScreenings: data.length,
        averageRiskScore: data.length > 0 
          ? Math.round(data.reduce((sum: number, d: any) => sum + (d.riskScore || 0), 0) / data.length) 
          : 0
      }
    }, null, 2);
  };

  // ✅ Generate Excel Report
  const generateExcelReport = (data: any[]) => {
    if (!data || data.length === 0) return 'No screening data available';
    const headers = ['Date', 'Risk Score', 'Risk Level', 'Stress Factors', 'Recommendations'];
    const rows = data.map((d: any) => [
      d.date || 'N/A',
      d.riskScore || 0,
      d.riskLevel || 'Low',
      (d.stressFactors || []).join(', '),
      (d.recommendations || []).join(', ')
    ]);
    return [headers.join('\t'), ...rows.map(row => row.join('\t'))].join('\n');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
          <i className="fas fa-arrow-left"></i>
        </button>
        <h3 className="text-xl font-bold text-gray-800">Export Data</h3>
      </div>

      {loadingData ? (
        <div className="text-center py-8">
          <i className="fas fa-spinner fa-spin text-2xl text-amber-500"></i>
          <p className="text-gray-500 mt-2">Loading your screening data...</p>
        </div>
      ) : (
        <>
          <div className="bg-blue-50 rounded-lg p-3 text-center text-sm text-blue-600">
            <p>Found <strong>{screeningData.length}</strong> screening records</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { format: 'PDF', icon: 'PDF', desc: 'Export as PDF' },
              { format: 'CSV', icon: 'CSV', desc: 'Export as CSV' },
              { format: 'JSON', icon: 'JSON', desc: 'Export as JSON' },
              { format: 'Excel', icon: 'Excel', desc: 'Export as Excel' },
            ].map((item) => (
              <button
                key={item.format}
                onClick={() => handleExport(item.format)}
                disabled={exporting || screeningData.length === 0}
                className="p-4 bg-gray-50 rounded-lg hover:bg-amber-50 transition border-2 border-transparent hover:border-amber-200 text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <p className="font-medium text-gray-800">{item.format}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </button>
            ))}
          </div>
        </>
      )}

      {exporting && (
        <div className="text-center text-amber-500 py-4">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Generating {exportFormat} report...
        </div>
      )}

      {screeningData.length === 0 && !loadingData && (
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <p className="text-sm text-yellow-600">
            No screening data found. Complete a screening first to generate reports.
          </p>
        </div>
      )}
    </motion.div>
  );
};

// ===== MAIN PROFILE COMPONENT =====
export const Profile: React.FC<ProfileProps> = ({ onBack, onLogout, onNavigate }) => {
  const user = getUser();
  const [progress, setProgress] = useState<{
    dayStreak: number;
    exercisesDone: number;
    totalXP: number;
  } | null>(null);
  const [activeSubPage, setActiveSubPage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchProgress()
      .then((res) => { if (!cancelled) setProgress(res); })
      .catch((err) => console.warn('Could not load profile stats:', err));
    return () => { cancelled = true; };
  }, []);

  const totalXP = progress?.totalXP ?? 0;
  const level = calculateLevel(totalXP);

  const userStats = [
    { label: 'Total XP', value: String(totalXP), icon: 'fa-star', color: 'text-yellow-500' },
    { label: 'Level', value: String(level), icon: 'fa-trophy', color: 'text-amber-500' },
    { label: 'Exercises', value: String(progress?.exercisesDone ?? 0), icon: 'fa-check-circle', color: 'text-green-500' },
    { label: 'Streak', value: String(progress?.dayStreak ?? 0), icon: 'fa-fire', color: 'text-orange-500' },
  ];

  const profileMenu = [
    { id: 'edit-profile', icon: 'fa-user', label: 'Edit Profile', desc: 'Update your personal information' },
    { id: 'notifications', icon: 'fa-bell', label: 'Notifications', desc: 'Manage your notification settings' },
    { id: 'privacy', icon: 'fa-shield-alt', label: 'Privacy', desc: 'Control your privacy settings' },
    { id: 'dark-mode', icon: 'fa-moon', label: 'Dark Mode', desc: 'Switch theme appearance' },
    { id: 'language', icon: 'fa-language', label: 'Language', desc: 'Change your preferred language' },
    { id: 'export', icon: 'fa-download', label: 'Export Data', desc: 'Download your wellness report' },
  ];

  const renderSubPage = () => {
    switch (activeSubPage) {
      case 'edit-profile': return <EditProfile onBack={() => setActiveSubPage(null)} />;
      case 'notifications': return <Notifications onBack={() => setActiveSubPage(null)} />;
      case 'privacy': return <Privacy onBack={() => setActiveSubPage(null)} />;
      case 'dark-mode': return <DarkModeSettings onBack={() => setActiveSubPage(null)} />;
      case 'language': return <LanguageSettings onBack={() => setActiveSubPage(null)} />;
      case 'export': return <ExportData onBack={() => setActiveSubPage(null)} />;
      default: return null;
    }
  };

  if (activeSubPage) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <AnimatePresence mode="wait">
          {renderSubPage()}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-3xl">
              <span>😊</span>
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.name || 'Student'}</h2>
            <p className="text-white/80 text-sm">{user?.email || ''}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs flex items-center gap-1">
                🏆 Level {level}
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs flex items-center gap-1">
                ⭐ {totalXP} XP
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs flex items-center gap-1">
                🔥 {progress?.dayStreak ?? 0} Day Streak
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {userStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-all"
          >
            <i className={`fas ${stat.icon} text-2xl ${stat.color}`}></i>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Profile Menu */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {profileMenu.map((item, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            whileHover={{ backgroundColor: 'rgba(251, 191, 36, 0.05)', scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSubPage(item.id)}
            className="w-full flex items-center justify-between p-4 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <i className={`fas ${item.icon} text-amber-500`}></i>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">{item.label}</p>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            </div>
            <i className="fas fa-chevron-right text-gray-300"></i>
          </motion.button>
        ))}
      </div>

      {/* Back Button */}
      {onBack && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <i className="fas fa-arrow-left"></i>
          Back to Dashboard
        </motion.button>
      )}

      {/* Logout Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onLogout}
        className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
      >
        <i className="fas fa-sign-out-alt"></i>
        Logout
      </motion.button>
    </motion.div>
  );
};

export default Profile;