import { Router } from 'express';
import { getTasks, addTask, updateConsume, removeTask } from './operations';

const router = Router();

router.get('/tasks', ({ user: { id } }, res, next) =>
  getTasks(id)
    .then((tasks) => res.json(tasks))
    .catch(next));

router.post('/tasks', ({ user: { id }, body: { name, duration }}, res, next) =>
  addTask(id, name, duration)
    .then(() => res.sendStatus(201))
    .catch(next));

router.delete('/tasks/:id', ({ user, params }, res, next) =>
  removeTask(user.id, params.id)
    .then(() => res.sendStatus(200))
    .catch(next));

router.put('/tasks/:id', ({ params, user, body: { consume }}, res, next) =>
  updateConsume(user.id, params.id, consume)
    .then(() => res.sendStatus(200))
    .catch(next));

export default router;
