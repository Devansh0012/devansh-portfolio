// Email templates with glassmorphic design matching your portfolio

export interface EmailTemplateProps {
  name?: string;
  email: string;
  verificationUrl: string;
  unsubscribeUrl: string;
  type: 'community' | 'blog';
}

export function getEmailTemplate({ email, verificationUrl, unsubscribeUrl, type }: EmailTemplateProps) {
  const isCommunity = type === 'community';
  
  const subject = isCommunity 
    ? "🚀 Welcome to Devansh's Developer Community" 
    : "📚 Confirm your subscription to Devansh's Engineering Blog";

  const title = isCommunity 
    ? "Welcome to the Developer Community!" 
    : "Confirm Your Blog Subscription";

  const description = isCommunity
    ? "You're almost in! Click below to confirm your spot in our exclusive community of builders, learners, and shippers."
    : "You're almost subscribed! Click below to confirm your subscription to monthly engineering deep dives and insights.";

  const whatToExpect = isCommunity ? [
    "🔬 Monthly live teardown sessions on resiliency patterns",
    "📖 Async book club on systems design and developer tooling", 
    "🚀 Early invites to community-led hackathons and AMAs",
    "💡 Behind-the-scenes engineering insights and experiments"
  ] : [
    "📊 Monthly digest with engineering deep dives",
    "🔍 Incident retrospectives and lessons learned",
    "🎯 Systems design patterns and best practices",
    "🔧 Developer tooling recommendations and guides"
  ];

  return {
    subject,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #f1f5f9;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      margin: 0;
      padding: 20px;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: rgba(30, 41, 59, 0.8);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 24px;
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
      padding: 40px 32px;
      text-align: center;
      border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    }
    
    .logo {
      display: inline-block;
      margin-bottom: 24px;
    }
    
    .logo-text {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.025em;
    }
    
    .logo-d1 {
      color: #3b82f6;
    }
    
    .logo-d2 {
      color: #f1f5f9;
    }
    
    .header h1 {
      font-size: 32px;
      font-weight: 600;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .header p {
      font-size: 18px;
      color: #cbd5e1;
      max-width: 400px;
      margin: 0 auto;
    }
    
    .content {
      padding: 40px 32px;
    }
    
    .glass-card {
      background: rgba(51, 65, 85, 0.6);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(100, 116, 139, 0.3);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 32px;
    }
    
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      margin: 24px 0;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.35);
    }
    
    .feature-list {
      list-style: none;
      padding: 0;
      margin: 24px 0;
    }
    
    .feature-list li {
      padding: 8px 0;
      color: #cbd5e1;
      font-size: 15px;
    }
    
    .footer {
      background: rgba(15, 23, 42, 0.8);
      padding: 32px;
      text-align: center;
      border-top: 1px solid rgba(148, 163, 184, 0.1);
    }
    
    .footer p {
      color: #94a3b8;
      font-size: 14px;
      margin-bottom: 16px;
    }
    
    .footer a {
      color: #3b82f6;
      text-decoration: none;
      font-size: 14px;
    }
    
    .footer a:hover {
      text-decoration: underline;
    }
    
    .social-links {
      margin-top: 24px;
    }
    
    .social-links a {
      color: #cbd5e1;
      text-decoration: none;
      margin: 0 12px;
      font-size: 14px;
    }
    
    .social-links a:hover {
      color: #3b82f6;
    }
    
    @media (max-width: 640px) {
      body {
        padding: 12px;
      }
      
      .header {
        padding: 24px 20px;
      }
      
      .content {
        padding: 24px 20px;
      }
      
      .footer {
        padding: 24px 20px;
      }
      
      .header h1 {
        font-size: 24px;
      }
      
      .header p {
        font-size: 16px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <div class="logo-text">
          <span class="logo-d1">D</span><span class="logo-d2">D</span>
        </div>
      </div>
      <h1>${title}</h1>
      <p>${description}</p>
    </div>
    
    <div class="content">
      <div class="glass-card">
        <h2 style="color: #f1f5f9; font-size: 20px; margin-bottom: 16px;">What to expect:</h2>
        <ul class="feature-list">
          ${whatToExpect.map((item: string) => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      
      <div style="text-align: center;">
        <a href="${verificationUrl}" class="cta-button">
          ${isCommunity ? '🚀 Join the Community' : '📚 Confirm Subscription'}
        </a>
      </div>
      
      <div style="background: rgba(15, 23, 42, 0.6); border-radius: 12px; padding: 20px; margin-top: 32px;">
        <p style="color: #94a3b8; font-size: 14px; margin: 0;">
          <strong>From Devansh:</strong> ${isCommunity 
            ? "I'm excited to have you join our community of builders! We'll share experiments, learnings, and build amazing things together."
            : "Thank you for subscribing! I'll share my best engineering insights and lessons learned from building resilient systems."
          }
        </p>
      </div>
    </div>
    
    <div class="footer">
      <p>This email was sent to <strong>${email}</strong></p>
      <p>Didn't sign up for this? <a href="${unsubscribeUrl}">Unsubscribe here</a></p>
      
      <div class="social-links">
        <a href="https://github.com/Devansh0012">GitHub</a>
        <a href="https://www.linkedin.com/in/devanshdubey1">LinkedIn</a>
        <a href="mailto:work@devanshdubey.com">Email</a>
        <a href="https://www.devanshdubey.com">Portfolio</a>
      </div>
      
      <p style="margin-top: 24px; font-size: 13px;">
        © ${new Date().getFullYear()} Devansh Dubey. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`,
    text: `
${title}

Hi there!

${description}

What to expect:
${whatToExpect.map(item => `• ${item.replace(/🔬|📖|🚀|💡|📊|🔍|🎯|🔧/g, '')}`).join('\n')}

Confirm your ${isCommunity ? 'community membership' : 'blog subscription'}: ${verificationUrl}

${isCommunity 
  ? "I'm excited to have you join our community of builders! We'll share experiments, learnings, and build amazing things together."
  : "Thank you for subscribing! I'll share my best engineering insights and lessons learned from building resilient systems."
}

This email was sent to ${email}
Didn't sign up for this? Unsubscribe: ${unsubscribeUrl}

Best regards,
Devansh Dubey
Software Development Engineer
https://www.devanshdubey.com
`
  };
}

export function getWelcomeEmail({ email, unsubscribeUrl, type }: Omit<EmailTemplateProps, 'verificationUrl'>) {
  const isCommunity = type === 'community';
  
  const subject = isCommunity 
    ? "🎉 Welcome to the Developer Community!" 
    : "📚 Welcome to Devansh's Engineering Blog!";

  const title = isCommunity 
    ? "You're officially in the community!" 
    : "Your blog subscription is confirmed!";

  return {
    subject,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #f1f5f9;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      margin: 0;
      padding: 20px;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: rgba(30, 41, 59, 0.8);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 24px;
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
      padding: 40px 32px;
      text-align: center;
      border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    }
    
    .success-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    
    .header h1 {
      font-size: 32px;
      font-weight: 600;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .content {
      padding: 40px 32px;
    }
    
    .glass-card {
      background: rgba(51, 65, 85, 0.6);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(100, 116, 139, 0.3);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
    }
    
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      margin: 16px 12px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
    }
    
    .footer {
      background: rgba(15, 23, 42, 0.8);
      padding: 32px;
      text-align: center;
      border-top: 1px solid rgba(148, 163, 184, 0.1);
    }
    
    .footer p {
      color: #94a3b8;
      font-size: 14px;
      margin-bottom: 16px;
    }
    
    .footer a {
      color: #3b82f6;
      text-decoration: none;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="success-icon">✨</div>
      <h1>${title}</h1>
      <p style="color: #cbd5e1; font-size: 18px;">
        ${isCommunity 
          ? "Get ready for an amazing journey of building, learning, and shipping together!" 
          : "Get ready for monthly engineering insights and deep technical dives!"}
      </p>
    </div>
    
    <div class="content">
      <div class="glass-card">
        <h2 style="color: #f1f5f9; font-size: 20px; margin-bottom: 16px;">What's next?</h2>
        <p style="color: #cbd5e1; margin-bottom: 16px;">
          ${isCommunity 
            ? "I'll be sending you exclusive content, early access to workshops, and invites to community events. Keep an eye on your inbox!"
            : "You'll receive your first engineering digest soon, packed with insights from building resilient distributed systems."}
        </p>
      </div>
      
      <div style="text-align: center;">
        <a href="https://www.devanshdubey.com/demos" class="cta-button">🎮 Try the Demos</a>
        <a href="https://www.devanshdubey.com/engineer" class="cta-button">🔧 Explore Projects</a>
      </div>

      <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 20px; margin-top: 32px;">
        <p style="color: #10b981; font-size: 14px; margin: 0; text-align: center;">
          <strong>🚀 Pro tip:</strong> Check out the interactive demos to explore visualizations of algorithms and system design concepts!
        </p>
      </div>
    </div>
    
    <div class="footer">
      <p>This email was sent to <strong>${email}</strong></p>
      <p>Want to unsubscribe? <a href="${unsubscribeUrl}">Click here</a></p>
      <p style="margin-top: 24px; font-size: 13px;">
        © ${new Date().getFullYear()} Devansh Dubey. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`,
    text: `
${title}

Hi there!

${isCommunity 
  ? "Get ready for an amazing journey of building, learning, and shipping together!" 
  : "Get ready for monthly engineering insights and deep technical dives!"}

What's next?
${isCommunity 
  ? "I'll be sending you exclusive content, early access to workshops, and invites to community events. Keep an eye on your inbox!"
  : "You'll receive your first engineering digest soon, packed with insights from building resilient distributed systems."}

Check out these while you wait:
• Interactive Demos: https://www.devanshdubey.com/demos
• Engineering Projects: https://www.devanshdubey.com/engineer

Pro tip: Check out the interactive demos to explore visualizations of algorithms and system design concepts!

This email was sent to ${email}
Unsubscribe: ${unsubscribeUrl}

Best regards,
Devansh Dubey
https://www.devanshdubey.com
`
  };
}