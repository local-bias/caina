namespace site {
  namespace document {
    type Frontmatter = {
      title: string;
      date: string;
    };

    type Props = Partial<Frontmatter> & { slug: string; content: string };
  }
}
