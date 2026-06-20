export function arxivIdFromPaper(paper) {
  return paper?.arxiv_id || paper?.id || ''
}

export function arxivAbsUrl(arxivId) {
  if (!arxivId) return '#'
  return `https://arxiv.org/abs/${arxivId}`
}

export function arxivPdfUrl(paper) {
  if (paper?.pdf_url) return paper.pdf_url
  const id = arxivIdFromPaper(paper)
  return id ? `https://arxiv.org/pdf/${id}` : '#'
}
