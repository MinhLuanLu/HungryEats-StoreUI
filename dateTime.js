// Function to get formatted date (YYYY-MM-DD)
const getFormattedDate = (date) => {
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' + 
      String(date.getDate()).padStart(2, '0');
  };
  
  // Function to get formatted time (HH:MM:SS)
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: false 
    });
  };
  
  // Function to log current date and time
  export const currentDateTime = () => {
    const currentTime = new Date(); // Get the current time
  
    const formattedDate = getFormattedDate(currentTime); // Format the date
    const formattedTime = formatTime(currentTime); // Format the time
    return formattedDate
  };

  