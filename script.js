
document.addEventListener('DOMContentLoaded', () => {
    // Definición de todos los ramos y sus prerrequisitos
    // 'course-id': ['prerequisite1', 'prerequisite2', ...]
    const courses = {
        // 1er Semestre (sin prerrequisitos, se listan para consistencia)
        'estrategias-aprendizaje': [],
        'antropologia': [],
        'fundamentos-biologicos': [],
        'procesos-cognitivos': [],
        'evolucion-historica': [],
        'fundamentos-filosoficos': [],
        'taller-comunicacion': [],

        // 2do Semestre
        'etica': ['antropologia'],
        'neuropsicologia': ['fundamentos-biologicos'],
        'procesos-afectivos': [],
        'fundamentos-sociantropologicos': [],
        'introduccion-metodologia-investigacion': [],
        'taller-trabajo-grupal': [],
        'electivo-formacion-integral-i': ['etica'],

        // 3er Semestre
        'psicologia-evolutiva-i': ['procesos-cognitivos', 'procesos-afectivos'],
        'psicologia-personalidad': ['procesos-cognitivos', 'procesos-afectivos'],
        'psicologia-social-i': [],
        'metodologia-investigacion-aplicada': ['introduccion-metodologia-investigacion'],
        'taller-entrevista': [],
        'electivo-formacion-integral-ii': [],

        // 4to Semestre
        'psicopatologia-general': ['psicologia-personalidad'],
        'psicologia-evolutiva-ii': ['psicologia-evolutiva-i'],
        'psicologia-social-ii': ['psicologia-social-i'],
        'analisis-datos-cuantitativos': ['metodologia-investigacion-aplicada'],
        'evaluacion-psicologica-cognitiva': ['neuropsicologia', 'psicologia-personalidad'],
        'electivo-formacion-integral-iii': [],

        // 5to Semestre
        'psicopatologia-psiquiatria-infantil': ['psicopatologia-general'],
        'teorias-psicologicas-i': ['evolucion-historica'],
        'analisis-datos-cualitativos': ['metodologia-investigacion-aplicada'],
        'evaluacion-psicologica-personalidad': ['evaluacion-psicologica-cognitiva'],
        'politicas-publicas': [],
        'electivo-formacion-integral-iv': [],

        // 6to Semestre
        'teorias-psicologicas-ii': ['evolucion-historica'], // Nota: En el prompt original solo se menciona "Evolución histórica de la psicología" para Teorías Psicológicas II, pero para mantener la coherencia con "Teorías Psicológicas I" que es un pre-requisito en semestres posteriores, lo mantengo aquí también. Si no fuera un pre-requisito, se podría considerar agregar "Teorías psicológicas I" como pre-requisito o ajustar los pre-requisitos de los ramos posteriores si dependen de ambas.
        'psicopatologia-psiquiatria-adulto': ['psicopatologia-general'],
        'evaluacion-psicologica-integrada': ['evaluacion-psicologica-personalidad'],
        'introduccion-formulacion-proyectos': ['metodologia-investigacion-aplicada'],
        'taller-persona-psicologo': ['evaluacion-psicologica-personalidad'],

        // 7mo Semestre
        'introduccion-psicoterapia-sistemica': ['teorias-psicologicas-i'],
        'introduccion-psicoterapia-psicoanalitica': ['teorias-psicologicas-i'],
        'comportamiento-organizacional': ['psicologia-social-ii', 'teorias-psicologicas-i', 'teorias-psicologicas-ii'],
        'factores-psicologicos-educativos': ['psicologia-social-ii', 'teorias-psicologicas-i', 'teorias-psicologicas-ii'],
        'problemas-psicosociales-actuales': ['psicologia-social-ii', 'teorias-psicologicas-i', 'teorias-psicologicas-ii'],
        'integracion-psicologia': ['teorias-psicologicas-i', 'teorias-psicologicas-ii'],

        // 8vo Semestre
        'introduccion-psicoterapia-cognitiva': ['teorias-psicologicas-ii'],
        'introduccion-psicoterapia-humanista': ['teorias-psicologicas-ii'],
        'gestion-personas-organizaciones': ['comportamiento-organizacional', 'teorias-psicologicas-i', 'teorias-psicologicas-ii'],
        'gestion-escolar': ['factores-psicologicos-educativos', 'teorias-psicologicas-i', 'teorias-psicologicas-ii'],
        'psicologia-comunitaria': ['problemas-psicosociales-actuales', 'teorias-psicologicas-i', 'teorias-psicologicas-ii'],
        'electivo-especializacion-i': [], // El prerrequisito "asignaturas de la misma área de niveles anteriores" es conceptual, no se implementa como bloqueo automático aquí.

        // 9no Semestre
        'electivos-diseno-intervencion': [], // Misma consideración que el Electivo Especialización I
        'electivos-diseno-contextos': [], // Misma consideración que el Electivo Especialización I
        'electivo-especializacion-ii': [],
        'proyecto-investigacion': ['analisis-datos-cuantitativos'],

        // 10mo Semestre
        'practica-profesional': ['todos-hasta-9no'], // Se manejará como un caso especial.
        'electivo-especializacion-iii': [],
        'seminario-investigacion': ['todos-hasta-9no'] // Se manejará como un caso especial.
    };

    // Función para obtener el estado guardado de los ramos
    const getApprovedCourses = () => {
        const storedCourses = localStorage.getItem('approvedCourses');
        return storedCourses ? JSON.parse(storedCourses) : {};
    };

    // Función para guardar el estado de los ramos
    const saveApprovedCourses = (approvedState) => {
        localStorage.setItem('approvedCourses', JSON.stringify(approvedState));
    };

    // Estado actual de los ramos aprobados
    let approvedCoursesState = getApprovedCourses();

    // Función para verificar si un ramo tiene sus prerrequisitos cumplidos
    const checkPrerequisites = (courseId) => {
        const prereqs = courses[courseId];

        // Manejo especial para "todos-hasta-9no"
        if (prereqs && prereqs.includes('todos-hasta-9no')) {
            // Se asume que para estos ramos, todos los ramos anteriores deben estar aprobados.
            // Esto es una simplificación; en un sistema real, se podría definir con más granularidad.
            const allPreviousCoursesApproved = Object.keys(courses).every(id => {
                // Excluir los mismos ramos del 10mo semestre para evitar recursión o bloqueo mutuo
                if (id === 'practica-profesional' || id === 'seminario-investigacion' || id === 'electivo-especializacion-iii') {
                    return true; // No consideramos estos ramos como pre-requisitos de sí mismos
                }
                // Si el ramo actual es anterior al 10mo semestre y no está aprobado, se considera no cumplido
                const courseElement = document.querySelector(`[data-course-id="${id}"]`);
                if (courseElement) {
                    // Obtener el semestre del curso actual y el semestre del curso 'todos-hasta-9no'
                    const courseSemester = parseInt(courseElement.closest('.semester').querySelector('h2').textContent.match(/\d+/)[0]);
                    // Consideramos que "todos-hasta-9no" implica todos los ramos hasta el 9no semestre.
                    // Para simplificar, asumimos que si un ramo tiene este prerequisito, está en el 10mo semestre.
                    // Y verificamos todos los ramos del 1er al 9no semestre.
                    if (courseSemester <= 9 && !approvedCoursesState[id]) {
                        return false;
                    }
                }
                return true;
            });
            return allPreviousCoursesApproved;
        }

        if (!prereqs || prereqs.length === 0) {
            return true; // No tiene prerrequisitos
        }

        // Verificar cada prerrequisito
        for (const prereqId of prereqs) {
            if (!approvedCoursesState[prereqId]) {
                return false; // Falta un prerrequisito
            }
        }
        return true; // Todos los prerrequisitos están cumplidos
    };

    // Función para obtener los nombres de los prerrequisitos faltantes
    const getMissingPrerequisitesNames = (courseId) => {
        const prereqs = courses[courseId];
        if (!prereqs || prereqs.length === 0) {
            return [];
        }

        const missing = [];
        for (const prereqId of prereqs) {
            if (!approvedCoursesState[prereqId]) {
                // Buscar el elemento del curso para obtener su texto
                const prereqElement = document.querySelector(`[data-course-id="${prereqId}"]`);
                if (prereqElement) {
                    missing.push(prereqElement.textContent);
                } else {
                    missing.push(prereqId); // En caso de no encontrar el elemento, usar el ID
                }
            }
        }
        return missing;
    };

    // Función para actualizar la UI de los ramos (aprobado/bloqueado)
    const updateCourseUI = () => {
        const allCourses = document.querySelectorAll('.course');
        allCourses.forEach(courseElement => {
            const courseId = courseElement.dataset.courseId;

            // Primero, remover todas las clases de estado para evitar conflictos
            courseElement.classList.remove('approved', 'blocked');
            courseElement.removeAttribute('title'); // Limpiar el tooltip

            if (approvedCoursesState[courseId]) {
                courseElement.classList.add('approved');
            } else {
                if (!checkPrerequisites(courseId)) {
                    courseElement.classList.add('blocked');
                    const missingPrereqs = getMissingPrerequisitesNames(courseId);
                    courseElement.title = `Faltan aprobar: ${missingPrereqs.join(', ')}`; // Tooltip para ramos bloqueados
                }
            }
        });
    };

    // Manejador de clic para los ramos
    const handleCourseClick = (event) => {
        const courseElement = event.target;
        const courseId = courseElement.dataset.courseId;

        // Si el ramo ya está aprobado, no hacer nada
        if (approvedCoursesState[courseId]) {
            alert(`"${courseElement.textContent}" ya está aprobado.`);
            return;
        }

        // Verificar si los prerrequisitos están cumplidos
        if (checkPrerequisites(courseId)) {
            // Marcar como aprobado
            approvedCoursesState[courseId] = true;
            saveApprovedCourses(approvedCoursesState);
            updateCourseUI(); // Actualizar la interfaz
            alert(`¡"${courseElement.textContent}" aprobado con éxito!`);
        } else {
            const missingPrereqs = getMissingPrerequisitesNames(courseId);
            alert(`No puedes aprobar "${courseElement.textContent}". Faltan los siguientes ramos: \n- ${missingPrereqs.join('\n- ')}`);
        }
    };

    // Inicializar la malla al cargar la página
    const init = () => {
        const allCourses = document.querySelectorAll('.course');
        allCourses.forEach(courseElement => {
            courseElement.addEventListener('click', handleCourseClick);
        });
        updateCourseUI(); // Actualizar el estado visual de los ramos al cargar
    };

    // Ejecutar la inicialización
    init();
});
