/*
------------------------------------------------
File: formatters.js
Purpose: Helper methods to clean UI parameters.
Responsibilities: Cleans timestamps, formats percentage tags, and limits descriptions.
Dependencies: None
------------------------------------------------
*/

/*
Formats timestamp elements.
*/
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/*
Truncates strings.
*/
export const truncateText = (text, limit = 60) => {
  if (!text) return '';
  return text.length > limit ? `${text.substring(0, limit)}...` : text;
};
