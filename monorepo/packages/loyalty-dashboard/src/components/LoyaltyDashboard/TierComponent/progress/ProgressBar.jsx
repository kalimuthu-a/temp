function RoundProgressBar(props) {
  const { size } = props;
  const radius = (props.size - props.strokeWidth) / 2;
  const viewBox = '0 0 120 120';
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - dashArray * props.value / props.max;
  const percentage = (props.value / props.max * 100).toFixed();
  function formatNumber(number) {
    if (number >= 1000) {
      const formattedNumber = (number / 1000).toFixed(1);
      return `${formattedNumber.replace(/\.0$/, '')}K`;
    }
    return number.toString();
  }
  return (
    <svg
      // width = {props.size}
      // height = {props.size}
      viewBox={viewBox}
    >
      <circle
        fill="none"
        stroke="#EAF8FF"
        cx={props.size / 2}
        cy={props.size / 2}
        r={radius}
        strokeWidth={`${props.strokeWidth}px`}
      />
      <circle
        fill="none"
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
        cx={props.size / 2}
        cy={props.size / 2}
        r={radius}
        strokeWidth={`${props.strokeWidth}px`}
        transform={`rotate(-90 ${props.size / 2} ${props.size / 2})`}
      />
      <text
        x="50%"
        y="34%"
        dy="0.4rem"
        textAnchor="middle"
        fill={props.stroke}
        style={{
          fontSize: '28px',
          fontWeight: '600',
          fontFamily: 'Poppins-Medium',
          color: '#009',
          lineHeight: '16px',
        }}
      >
        {`\n${props?.value ? formatNumber(props?.value) : 0}`}
      </text>

      <text
        x="50%"
        y="64%"
        dy=".4rem"
        textAnchor="middle"
        fill="#25304B"
        style={
          {
            fontSize: '12px',
            fontWeight: '300',
            fontFamily: 'Poppins-Regular',
            color: '#25304B',
            lineHeight: '16px',
          }
        }
      >
        {`\n${props?.max ? formatNumber(props?.max) : 0}`}
      </text>
      <line x1="70" x2="50" y2="60" y1="60" stroke="#000" strokeWidth="0.5" />
    </svg>
  );
}

RoundProgressBar.defaultProps = {
  size: 200,
  value: 25,
  max: 100,
  strokeWidth: 10,
  stroke: 'red',
  text: '',
};

function ProgressBar(props) {
  const percentage = 25;

  return (
    <div>
      <div className="circulr-bar">
        <RoundProgressBar
          max={Number(props.max)}
          size={props.size}
          value={Number(props.value)}
          stroke={props.stroke}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
