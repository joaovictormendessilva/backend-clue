import { createCards } from './cards.seed';

export const main = async () => {
  await createCards();
};

main()
  .then(() => {
    console.log('🌱 The seed has been successfuly created.');
    process.exit(0);
  })
  .catch((error) => {
    console.log('Error creating the seeds.', error);
    process.exit(1);
  });
