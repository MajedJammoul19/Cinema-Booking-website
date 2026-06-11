// utils/timeFormat.js or wherever you have it
const timeFormat = (minutes) => {
    if (!minutes && minutes !== 0) return 'TBA';
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
        return `${remainingMinutes}m`;
    }
    if (remainingMinutes === 0) {
        return `${hours}h`;
    }
    return `${hours}h ${remainingMinutes}m`;
}

export default timeFormat;