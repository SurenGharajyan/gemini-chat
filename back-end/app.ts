import app from './setup';

const PORT = process.env.PORT || 3344;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
