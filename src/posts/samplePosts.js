const samplePosts = [
  {
    slug: 'beauty-of-bharatanatyam',
    title: 'The Beauty of Bharatanatyam',
    date: '2024-06-01',
    excerpt: 'Discover the grace and tradition of Bharatanatyam dance.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    content: `# The Beauty of Bharatanatyam\n\nBharatanatyam is one of the oldest classical dance forms of India, known for its grace, purity, and expressive gestures. The dance is a celebration of tradition, devotion, and storytelling.\n\nFrom the intricate footwork to the expressive abhinaya, every movement in Bharatanatyam tells a story. Students learn not just dance, but discipline, culture, and the joy of performance.\n\nWhether you are a beginner or an experienced dancer, Bharatanatyam offers a lifelong journey of learning and self-discovery.\n\nJoin us at TandavaLasya to experience the beauty of this ancient art form!\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod nisi.`
  },
  {
    slug: 'student-spotlight-arangetram',
    title: 'Student Spotlight: Arangetram',
    date: '2024-05-15',
    excerpt: "Celebrating our students' achievements and milestones.",
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    content: `# Student Spotlight: Arangetram\n\nArangetram is a major milestone in a Bharatanatyam dancer's journey. It marks the debut on stage after years of dedicated practice.\n\nOur students have made us proud with their commitment, artistry, and passion.\n\nCongratulations to all who have completed their Arangetram this year!\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod nisi.`
  },
  {
    slug: 'upcoming-workshops',
    title: 'Upcoming Workshops',
    date: '2024-05-01',
    excerpt: 'Join our next workshop and learn new skills!',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    content: `# Upcoming Workshops\n\nWe regularly host workshops on various aspects of Bharatanatyam, from abhinaya to rhythm and choreography.\n\nStay tuned for our next workshop announcement!\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod nisi.`
  },
  {
    slug: 'history-of-bharatanatyam',
    title: 'The History of Bharatanatyam',
    date: '2024-04-20',
    excerpt: 'A journey through the origins and evolution of Bharatanatyam.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    content: `# The History of Bharatanatyam\n\nBharatanatyam has a rich history that dates back thousands of years.\n\nFrom temple rituals to the modern stage, the dance has evolved while preserving its core values.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod nisi.`
  },
  {
    slug: 'costume-and-makeup',
    title: 'Costume and Makeup in Bharatanatyam',
    date: '2024-04-10',
    excerpt: 'The significance of costume and makeup in performance.',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80',
    content: `# Costume and Makeup in Bharatanatyam\n\nThe vibrant costumes and traditional makeup are an integral part of Bharatanatyam.\n\nThey enhance the beauty of the dance and help convey emotions to the audience.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod nisi.`
  },
  {
    slug: 'importance-of-mudras',
    title: 'The Importance of Mudras',
    date: '2024-03-30',
    excerpt: 'How hand gestures bring stories to life in Bharatanatyam.',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fd9?auto=format&fit=crop&w=400&q=80',
    content: `# The Importance of Mudras\n\nMudras are symbolic hand gestures that are essential to Bharatanatyam.\n\nEach mudra has a specific meaning and is used to express ideas, emotions, and stories.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod nisi.`
  },
  {
    slug: 'music-in-bharatanatyam',
    title: 'Music in Bharatanatyam',
    date: '2024-03-15',
    excerpt: 'The role of music and rhythm in dance.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    content: `# Music in Bharatanatyam\n\nMusic is the soul of Bharatanatyam.\n\nThe interplay of rhythm, melody, and movement creates a mesmerizing experience for both dancer and audience.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod nisi.`
  },
  {
    slug: 'abhinaya-expressions',
    title: 'Abhinaya: The Art of Expression',
    date: '2024-03-01',
    excerpt: 'Mastering facial expressions in Bharatanatyam.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    content: `# Abhinaya: The Art of Expression\n\nAbhinaya is the art of expression in Bharatanatyam.\n\nIt allows dancers to convey complex emotions and stories through subtle facial movements.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod nisi.`
  },
  {
    slug: 'teaching-methods',
    title: 'Teaching Methods at TandavaLasya',
    date: '2024-02-15',
    excerpt: 'Our approach to nurturing every student.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    content: `# Teaching Methods at TandavaLasya\n\nAt TandavaLasya, we believe in a holistic approach to teaching.\n\nOur classes are designed to nurture creativity, discipline, and confidence in every student.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod nisi.`
  },
  {
    slug: 'parent-testimonials',
    title: 'Parent Testimonials',
    date: '2024-02-01',
    excerpt: 'What parents say about our school.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    content: `# Parent Testimonials\n\nWe are grateful for the support and encouragement from our students' families.\n\nHere are some testimonials from parents who have seen their children grow through dance.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod nisi.`
  },
];

export default samplePosts; 