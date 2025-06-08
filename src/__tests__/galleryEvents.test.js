import galleryEvents from '../posts/galleryEvents';

describe('galleryEvents', () => {
  test('exports valid gallery events data', () => {
    expect(galleryEvents).toBeDefined();
    expect(Array.isArray(galleryEvents)).toBe(true);
  });

  test('each gallery event has required properties', () => {
    galleryEvents.forEach(event => {
      expect(event).toHaveProperty('slug');
      expect(event).toHaveProperty('title');
      expect(event).toHaveProperty('date');
      expect(event).toHaveProperty('excerpt');
      expect(event).toHaveProperty('content');
      expect(event).toHaveProperty('image');
    });
  });

  test('contains expected number of events', () => {
    expect(galleryEvents.length).toBeGreaterThan(0);
  });

  test('gallery events have valid property types', () => {
    galleryEvents.forEach(event => {
      expect(typeof event.slug).toBe('string');
      expect(typeof event.title).toBe('string');
      expect(typeof event.date).toBe('string');
      expect(typeof event.excerpt).toBe('string');
      expect(typeof event.content).toBe('string');
      expect(typeof event.image).toBe('string');
    });
  });

  test('event content is non-empty', () => {
    galleryEvents.forEach(event => {
      expect(event.title.length).toBeGreaterThan(0);
      expect(event.content.length).toBeGreaterThan(0);
      expect(event.excerpt.length).toBeGreaterThan(0);
    });
  });

  test('each event has unique slug', () => {
    const slugs = galleryEvents.map(event => event.slug);
    const uniqueSlugs = [...new Set(slugs)];
    expect(slugs.length).toBe(uniqueSlugs.length);
  });

  test('event dates follow expected format', () => {
    galleryEvents.forEach(event => {
      expect(event.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
}); 