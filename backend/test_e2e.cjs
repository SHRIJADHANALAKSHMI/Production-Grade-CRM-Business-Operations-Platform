const axios = require('axios');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: '6a906a187216483057e94033', role: 'Admin' }, process.env.JWT_SECRET, { expiresIn: '30d' });
const api = axios.create({ baseURL: 'http://localhost:5000/api', headers: { Authorization: 'Bearer ' + token } });

async function testWorkflow() {
    try {
        console.log('1. Checking Dashboard...');
        const dash = await api.get('/dashboard');
        console.log('   Dashboard OK:', Object.keys(dash.data.data).length + ' widgets loaded');

        console.log('2. Creating Test Lead...');
        const leadRes = await api.post('/leads', { name: 'E2E Test Lead', email: 'e2e' + Date.now() + '@example.com', phone: '555-0000', company: 'Automated Inc', status: 'new' });
        const newLead = leadRes.data.data;
        console.log('   Lead OK:', newLead._id);

        console.log('3. Converting Lead to Client & Project...');
        const convertRes = await api.post('/leads/' + newLead._id + '/convert');
        const { client, project } = convertRes.data.data;
        console.log('   Client OK:', client._id);
        console.log('   Project OK:', project._id);

        console.log('4. Creating Task in Project...');
        const taskRes = await api.post('/tasks', { title: 'E2E Test Task', project: project._id, status: 'todo' });
        console.log('   Task OK:', taskRes.data.data?._id || 'Created');

        console.log('5. Refreshing Project Data...');
        const projRes = await api.get('/projects/' + project._id);
        console.log('   Project Workspace OK: tasks=' + projRes.data.data.tasks.length);

        console.log('\n✅ ALL PIPELINE STEPS COMPLETED 100% SUCCESSFULLY VIA HTTP API!');
    } catch (e) {
        console.error('\n❌ API WORKFLOW FAILED:', e.response ? JSON.stringify(e.response.data, null, 2) : e.message);
    }
}
testWorkflow();
