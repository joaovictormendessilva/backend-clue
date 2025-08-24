import { createCards } from './cards.seed';
import { createSessionsState } from './sessions-state.seed';
import { createSessions } from './sessions.seed';
import { createUsers } from './users.seed';

export const main = async () => {
  await Promise.all([createCards(), createUsers()]);

  await createSessions();
  await createSessionsState();
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
