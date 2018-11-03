import { queryAsync, queryRowsAsync } from '../db/postgres';

export const getTasks = (user_id: string) =>
  queryRowsAsync(
    `SELECT task_name, task_duration, task_consumed
    FROM tasks
    WHERE user_id = $1`,
    [user_id],
  );

export const addTask = (user_id: string, name: string, duration: number) =>
  queryRowsAsync(
    `INSERT INTO tasks (user_id, name, duration)
    VALUES ($1, $2)
    RETURNING mileage_id as id`,
    [user_id, name, duration],
  ).then((rows) => rows[0]);

export const updateConsume = (user_id: string, task_id: string, consumed: number) =>
  queryRowsAsync(
    `UPDATE tasks
    SET consumed = $1
    WHERE task_id = $2 AND user_id = $3`,
    [consumed, task_id, user_id],
  );

export const removeTask = (user_id: string, task_id: string) =>
  queryRowsAsync(
    `DELETE FROM tasks
    WHERE task_id = $1 AND user_id = $2`,
    [task_id, user_id],
  );
