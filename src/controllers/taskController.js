const Task = require('../models/Task');

const taskController = {
    // Create new task
    createTask: async (req, res) => {
        try {
            const task = new Task({
                ...req.body,
                createdBy: req.user._id
            });
            await task.save();
            res.status(201).json(task);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Get all tasks
    getAllTasks: async (req, res) => {
        try {
            const tasks = await Task.find({})
                .populate('assignedTo', 'username email')
                .populate('createdBy', 'username email');
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get task by ID
    getTaskById: async (req, res) => {
        try {
            const task = await Task.findById(req.params.id)
                .populate('assignedTo', 'username email')
                .populate('createdBy', 'username email');
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json(task);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update task
    updateTask: async (req, res) => {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['title', 'description', 'status', 'assignedTo'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ error: 'Invalid updates' });
        }

        try {
            const task = await Task.findById(req.params.id);
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }

            updates.forEach(update => task[update] = req.body[update]);
            task.updatedAt = Date.now();
            await task.save();
            res.json(task);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Delete task
    deleteTask: async (req, res) => {
        try {
            const task = await Task.findByIdAndDelete(req.params.id);
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json({ message: 'Task deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = taskController;
