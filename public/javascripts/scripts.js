const API_URL = '/api/v1/videojuegos';

const tablaVideojuegos = document.getElementById('tabla-videojuegos-contenido');
const formulario = document.getElementById('formulario-videojuego');
const campoId = document.getElementById('videojuego-id');
const campoNombre = document.getElementById('nombre');
const campoEmpresa = document.getElementById('empresa');
const campoFecha = document.getElementById('fecha_lanzamiento');
const campoEstrellas = document.getElementById('estrellas');
const tituloFormulario = document.getElementById('form-titulo');
const btnCancelar = document.getElementById('btn-cancelar');
const mensaje = document.getElementById('mensaje');

function mostrarMensaje(texto, tipo = 'success') {
  mensaje.className = `alert alert-${tipo}`;
  mensaje.textContent = texto;
}

function limpiarMensaje() {
  mensaje.className = 'alert d-none';
  mensaje.textContent = '';
}

function modoCrear() {
  campoId.value = '';
  formulario.reset();
  tituloFormulario.textContent = 'Agregar videojuego';
  btnCancelar.classList.add('d-none');
}

function modoEditar(videojuego) {
  campoId.value = videojuego.id;
  campoNombre.value = videojuego.nombre;
  campoEmpresa.value = videojuego.empresa;
  campoFecha.value = videojuego.fecha_lanzamiento;
  campoEstrellas.value = videojuego.estrellas;
  tituloFormulario.textContent = 'Editar videojuego';
  btnCancelar.classList.remove('d-none');
  campoNombre.focus();
}

function validarFormulario() {
  const estrellasNumero = Number(campoEstrellas.value);
  if (!campoNombre.value.trim() || !campoEmpresa.value.trim() || !campoFecha.value || !estrellasNumero) {
    mostrarMensaje('Completa todos los campos del formulario.', 'warning');
    return false;
  }

  if (estrellasNumero < 1 || estrellasNumero > 5) {
    mostrarMensaje('La calificación debe estar entre 1 y 5.', 'warning');
    return false;
  }

  return true;
}

function renderTabla(videojuegos) {
  tablaVideojuegos.innerHTML = '';

  if (videojuegos.length === 0) {
    const filaVacia = document.createElement('tr');
    filaVacia.innerHTML = '<td colspan="6" class="text-center text-muted">No hay videojuegos registrados todavía.</td>';
    tablaVideojuegos.appendChild(filaVacia);
    return;
  }

  videojuegos.forEach((v, index) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <th scope="row">${index + 1}</th>
      <td>${v.nombre}</td>
      <td>${v.empresa}</td>
      <td>${v.fecha_lanzamiento}</td>
      <td>${v.estrellas} de 5</td>
      <td>
        <button type="button" class="btn btn-primary btn-sm me-2 btn-editar">Editar</button>
        <button type="button" class="btn btn-danger btn-sm btn-eliminar">Eliminar</button>
      </td>
    `;

    tr.querySelector('.btn-editar').addEventListener('click', () => modoEditar(v));
    tr.querySelector('.btn-eliminar').addEventListener('click', async () => {
      const confirmado = window.confirm(`¿Seguro que deseas eliminar "${v.nombre}"?`);
      if (!confirmado) return;

      try {
        const res = await fetch(`${API_URL}/${v.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('No se pudo eliminar el registro.');

        mostrarMensaje('Videojuego eliminado correctamente.', 'success');
        if (campoId.value === String(v.id)) {
          modoCrear();
        }
        await cargarVideojuegos();
      } catch (error) {
        mostrarMensaje(error.message, 'danger');
      }
    });

    tablaVideojuegos.appendChild(tr);
  });
}

async function cargarVideojuegos() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('No se pudo obtener la lista de videojuegos.');
    const data = await res.json();
    renderTabla(data);
  } catch (error) {
    mostrarMensaje(error.message, 'danger');
  }
}

formulario.addEventListener('submit', async (e) => {
  e.preventDefault();
  limpiarMensaje();

  if (!validarFormulario()) return;

  const body = {
    nombre: campoNombre.value.trim(),
    empresa: campoEmpresa.value.trim(),
    fecha_lanzamiento: campoFecha.value,
    estrellas: Number(campoEstrellas.value)
  };

  const id = campoId.value;
  const esEdicion = Boolean(id);

  try {
    const res = await fetch(esEdicion ? `${API_URL}/${id}` : API_URL, {
      method: esEdicion ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'No fue posible guardar el videojuego.');
    }

    mostrarMensaje(esEdicion ? 'Videojuego actualizado correctamente.' : 'Videojuego agregado correctamente.', 'success');
    modoCrear();
    await cargarVideojuegos();
  } catch (error) {
    mostrarMensaje(error.message, 'danger');
  }
});

btnCancelar.addEventListener('click', () => {
  modoCrear();
  limpiarMensaje();
});

modoCrear();
cargarVideojuegos();
