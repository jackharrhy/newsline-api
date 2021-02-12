export default (context: string) => (message: string) => {
  console.log(`[${context}] ${message}`);
};
