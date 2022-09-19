const DayLabels = () => {
  const DAYS_SHORT = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  return (
    <>
      {DAYS_SHORT.map((dayLabel, index) => (
        <div className="dayLabel cell" key={index}>
          {dayLabel}
        </div>
      ))}
    </>
  )
}

export default DayLabels
