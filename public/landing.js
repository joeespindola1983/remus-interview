const current = new URL(window.location.href);

function preserveParameters(link, allowedParameters) {
  const target = new URL(link.getAttribute("href"), current);
  for (const key of allowedParameters) {
    const value = current.searchParams.get(key);
    if (value) target.searchParams.set(key, value);
  }
  link.href = `${target.pathname}${target.search}`;
}

preserveParameters(document.querySelector("#initial-questionnaire-link"), ["name", "source"]);
preserveParameters(document.querySelector("#club-questionnaire-link"), ["club", "source"]);
