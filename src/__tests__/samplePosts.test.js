import samplePosts from '../posts/samplePosts';

describe('samplePosts', () => {
  test('exports valid sample posts data', () => {
    expect(samplePosts).toBeDefined();
    expect(Array.isArray(samplePosts)).toBe(true);
  });

  test('each post has required properties', () => {
    samplePosts.forEach(post => {
      expect(post).toHaveProperty('slug');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('date');
      expect(post).toHaveProperty('excerpt');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('image');
    });
  });

  test('contains expected number of posts', () => {
    expect(samplePosts.length).toBeGreaterThan(0);
  });

  test('post properties are valid types', () => {
    samplePosts.forEach(post => {
      expect(typeof post.slug).toBe('string');
      expect(typeof post.title).toBe('string');
      expect(typeof post.date).toBe('string');
      expect(typeof post.excerpt).toBe('string');
      expect(typeof post.content).toBe('string');
      expect(typeof post.image).toBe('string');
    });
  });

  test('post content is non-empty', () => {
    samplePosts.forEach(post => {
      expect(post.title.length).toBeGreaterThan(0);
      expect(post.content.length).toBeGreaterThan(0);
      expect(post.excerpt.length).toBeGreaterThan(0);
    });
  });

  test('each post has unique slug', () => {
    const slugs = samplePosts.map(post => post.slug);
    const uniqueSlugs = [...new Set(slugs)];
    expect(slugs.length).toBe(uniqueSlugs.length);
  });

  test('post dates follow expected format', () => {
    samplePosts.forEach(post => {
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
}); 