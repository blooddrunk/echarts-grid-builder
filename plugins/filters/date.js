import { format } from 'date-fns';

export default (value, formatString = 'yyyy-MM-dd') => {
  if (!value) {
    return null;
  }

  return format(value, formatString);
};
