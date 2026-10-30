const paths = {
  plus: 'M12 5v14M5 12h14',
  close: 'm6 6 12 12M18 6 6 18',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  // Same 28px geometry as vivaldi/icons/flat/Forward.svg.
  forward: 'M7 14h14m-6-6 6 6-6 6',
  search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  settings: 'M4 7h16M4 17h16M8 4v6M16 14v6',
  edit: 'm15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15v5Z',
  mail: 'M3 5h18v14H3zM3 5l9 7 9-7',
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-14-2 16',
  calendar: 'M4 5h16v16H4zM8 3v5m8-5v5M4 11h16m-12 4h3m3 0h3',
  folder: 'M3 6h7l2 3h9v11H3z',
  design: 'M5 3h7v7H5zm7 0h7v7h-7M5 10h7v7H5zm7 0h7v7h-7M5 17h7v4H5z',
  music: 'M9 18V5l11-2v13M9 15c-8-2-8 7-1 5m12-7c-8-2-8 7-1 5',
  left: 'm15 5-7 7 7 7',
  right: 'm9 5 7 7-7 7',
  note: 'M5 3h14v18H5zM8 8h8M8 12h8M8 16h5',
  check: 'm5 12 4 4L19 6',
};
export function Icon({ name, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.arrow} />
    </svg>
  );
}
