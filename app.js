const express = require('express');
const fs = require('fs/promises');

const app = express();
const PORT = 3000;

// Utility to read JSON files
const readJSONFile = async (filename) => {
  try {
    const data = await fs.readFile(filename, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
    throw error;
  }
};

// API to get employee details by ID
app.get('/employee/:id', async (req, res) => {
  const employeeId = parseInt(req.params.id);
  try {
    const employees = await readJSONFile('./employee.json');
    const employee = employees.find((emp) => emp.id === employeeId);
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee data' });
  }
});

// API to get project details by ID
app.get('/project/:id', async (req, res) => {
  const projectId = parseInt(req.params.id);
  try {
    const projects = await readJSONFile('./projects.json');
    const project = projects.find((proj) => proj.id === projectId);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project data' });
  }
});

// API to get employee details along with project details
app.get('/getemployeedetails/:id', async (req, res) => {
  const employeeId = parseInt(req.params.id);

  try {
    // Fetch employee data
    const employees = await readJSONFile('./employee.json');
    const employee = employees.find((emp) => emp.id === employeeId);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Fetch project data
    const projects = await readJSONFile('./projects.json');
    const project = projects.find((proj) => proj.id === employee.projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Combine employee and project data
    const result = {
      employee,
      project,
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee and project data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
