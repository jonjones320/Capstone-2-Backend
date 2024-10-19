const { format, parse, isValid } = require('date-fns');

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

  const formats = [
    'yyyy-MM-dd',
    'MM/dd/yyyy',
    'dd/MM/yyyy',
    'MM-dd-yyyy',
    'dd-MM-yyyy',
    'yyyy/MM/dd'
  ];

  let date;

  for (let fmt of formats) {
    date = parse(dateString, fmt, new Date());
    if (isValid(date)) {
      return format(date, 'yyyy-MM-dd');
    }
  }

  throw new InvalidDateError(`Invalid date format: ${dateString}`);
};

module.exports = formatDate;