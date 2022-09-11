export type Filter<P = unknown> = {
  field: string;
  event: string;
  payload?: P;
};

// export type Filter<P = unknown> = {
//   field: string;
//   event: string;
//   payload?: P;
//   message: (field: string, oldValue: unknown, newValue: unknown, payload?: P) => string;
// };
