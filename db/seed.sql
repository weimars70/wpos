-- NOTA: hashes bcrypt de 'Admin123!' para admin, 'Test123!' para el resto
INSERT INTO users (email, password, name) VALUES
(
  'admin@huellas.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Administrador'
),
(
  'juan@huellas.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Juan Pérez'
),
(
  'maria@huellas.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'María García'
),
(
  'carlos@huellas.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Carlos López'
)
ON CONFLICT (email) DO NOTHING;
