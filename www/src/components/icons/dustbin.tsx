type BinProps = {
  size: string;
};

const Bin = ({ size }: BinProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <g
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        stroke-miterlimit="10"
        d="M21 23.5h-5l-1.5-7h8zm-17.5-12v12L7 17l3.5 6.5v-12L16 9L7 7.5l-4.5 1l-2 6.5l3-2.5m6-7.5L7 6.5L4.5 5V2L7 .5L9.5 2z"
      />
      <path d="m17 11.995l.505.505l-.505.505m0-1.01l-.505.505l.505.505m3.5-3.01l.505.504l-.505.505m0-1.009l-.505.504l.505.505" />
    </g>
  </svg>
);

export default Bin;
