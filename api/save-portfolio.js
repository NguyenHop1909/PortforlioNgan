// Public deployments are read-only. Git credentials stay on the owner's computer.
export default function handler(_request, response) {
  response.status(403).json({ error: 'Public editing is disabled. Use the local portfolio editor.' });
}
