// CompTIA Security+ (SY0-701): the exam's 28 objectives (CompTIA's published titles) and the chapters of the study guide
// the owner reads (Chapple and Seidl, CompTIA Security+ Study Guide, 9th ed.). Cybersecurity lessons are tagged with
// both (`objectives: 1.4, 3.3` and `chapter: 7` in a deck's front matter), so they can be studied by objective or by
// chapter, and each lesson ends by pointing back to the owner's exam-practice Study Lab.
export const OBJECTIVES: Record<string, string> = {
  '1.1': 'Security controls', '1.2': 'Fundamental security concepts', '1.3': 'Change management', '1.4': 'Cryptographic solutions',
  '2.1': 'Threat actors and motivations', '2.2': 'Threat vectors and attack surfaces', '2.3': 'Types of vulnerabilities', '2.4': 'Indicators of malicious activity', '2.5': 'Mitigation techniques',
  '3.1': 'Architecture models', '3.2': 'Securing enterprise infrastructure', '3.3': 'Protecting data', '3.4': 'Resilience and recovery',
  '4.1': 'Securing computing resources', '4.2': 'Asset management', '4.3': 'Vulnerability management', '4.4': 'Alerting and monitoring', '4.5': 'Enhancing enterprise security', '4.6': 'Identity and access management', '4.7': 'Automation and orchestration', '4.8': 'Incident response', '4.9': 'Data sources for investigations',
  '5.1': 'Security governance', '5.2': 'Risk management', '5.3': 'Third-party risk', '5.4': 'Security compliance', '5.5': 'Audits and assessments', '5.6': 'Security awareness',
};
export const DOMAINS: Record<string, string> = { '1': 'General Security Concepts', '2': 'Threats, Vulnerabilities, and Mitigations', '3': 'Security Architecture', '4': 'Security Operations', '5': 'Security Program Management and Oversight' };
export const CHAPTERS: Record<string, string> = {
  '1': "Today's Security Professional", '2': 'Cybersecurity Threat Landscape', '3': 'Malicious Code', '4': 'Social Engineering and Password Attacks', '5': 'Security Assessment and Testing',
  '6': 'Application Security', '7': 'Cryptography and the PKI', '8': 'Identity and Access Management', '9': 'Resilience and Physical Security', '10': 'Cloud and Virtualization Security',
  '11': 'Endpoint Security', '12': 'Network Security', '13': 'Wireless and Mobile Security', '14': 'Monitoring and Incident Response', '15': 'Digital Forensics', '16': 'Security Governance and Compliance', '17': 'Risk Management and Privacy',
};
/** "1.4 Cryptographic solutions" */
export const objectiveName = (code: string) => `${code} ${OBJECTIVES[code] ?? ''}`.trim();
/** "Ch. 7 Cryptography and the PKI" */
export const chapterName = (n: string) => `Ch. ${n} ${CHAPTERS[n] ?? ''}`.trim();
