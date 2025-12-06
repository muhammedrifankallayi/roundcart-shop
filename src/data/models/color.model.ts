export interface Color {
    _id: string;
  name: string;
  hex?: string; // optional hex code like '#FF0000'
  rgb?: string; // optional rgb string like 'rgb(255,0,0)'
  createdAt?: Date;
  updatedAt?: Date;
}