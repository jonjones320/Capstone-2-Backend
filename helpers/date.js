const { format, parseISO } = require('date-fns');

class InvalidDateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidDateError';
  }
}

const formatDate = (dateString) => {
  if (typeof dateString !== 'string') {
    throw new InvalidDateError('Input must be a string');
  }

  let date;

  // Try to parse the date as an ISO string.
  try {
    date = parseISO(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid ISO date');
    }
  } catch (error) {
    // If ISO parsing fails, try other common formats
    const formats = [
      'yyyy-MM-dd',
      'MM/dd/yyyy',
      'dd/MM/yyyy',
      'MM-dd-yyyy',
      'dd-MM-yyyy',
      'yyyy/MM/dd'
    ];

    for (let fmt of formats) {
      date = parse(dateString, fmt, new Date());
      if (!isNaN(date.getTime())) {
        break;
      }
    }

    if (isNaN(date.getTime())) {
      throw new InvalidDateError(`Invalid date format: ${dateString}`);
    }
  }

  // Format the date as YYYY-MM-DD
  return format(date, 'yyyy-MM-dd');
};

module.exports = formatDate;