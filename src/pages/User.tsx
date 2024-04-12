import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function User() {
  // extender de algo
  // Clase que este encargada de hacer todos los fetsh
  // User service que haga fechs al backend
  const { id } = useParams();
  // Debuelve el objeto pero usamos el id, que se localiza con las llaves
  const [data, setData] = useState();

  useEffect(() => {
    let path = `http://localhost:8080`;

    // Le pasas funciones y dependencias

    // Logica de hacer la request al servidor y que te retorne un userId.
    const fetchData = async () => {
      // Debe ser asincronica para que no se detenga el resto del programa

      const response = await fetch(`${path}/api/v1/users/${id}`); // Se espera a que se complete

      if (!response.ok) {
        //TODO respuesta no esta bien
      }

      const responseData = await response.json();
      setData(responseData);
      console.log(data);
    };

    fetchData();
    //  Detecta cambios en el use-efect
  }, [id]);

  return <div>{data.email}</div>;
}
