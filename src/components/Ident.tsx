import React, { Fragment } from 'react';

interface IdentProps {
  level: number;
  show?: boolean;
  spaces?: number;
}

const Ident:React.FC<IdentProps> = ({level, show = true, spaces = 4}) => show && Array.from({ length: level * spaces }).map((_, index) => (
  <Fragment key={index}>&nbsp;</Fragment>
));

export default Ident;