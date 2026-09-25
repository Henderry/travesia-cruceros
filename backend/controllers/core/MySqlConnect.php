<?php

use Psr\Log\LoggerInterface;
class MySqlConnect {
	private $result;
	private $sql;
	private $username;
	private $password;
	private $host;
	private $dbname;
	private $link;

	private $log;
	private $inTransaction = false;
	
	public function __construct() {
		// Parametros de conexión
		$this->username = Config::get('DB_USERNAME');
		$this->password = Config::get('DB_PASSWORD');
		$this->host = Config::get('DB_HOST');
		$this->dbname = Config::get('DB_DBNAME');
		//Instancia Log
		$this->log = new Logger();
	}
	/**
	 * Establecer la conexión
	 */
	public function connect() {
		// Dentro de una transacción se reutiliza la misma conexión
		if ($this->inTransaction && $this->link) {
			return;
		}
		try {
			$this->link = mysqli_init();
			$flags = 0;
			if (filter_var(Config::get('DB_SSL', false), FILTER_VALIDATE_BOOLEAN)) {
				$this->link->ssl_set(null, null, Config::get('DB_SSL_CA', '/etc/ssl/certs/ca-certificates.crt'), null, null);
				$flags = MYSQLI_CLIENT_SSL;
			}
			$this->link->real_connect($this->host, $this->username, $this->password, $this->dbname,
				(int) Config::get('DB_PORT', 3306), null, $flags);
			$this->link->set_charset('utf8mb4');
		} catch ( Exception $e ) {
			handleException($e);
		}
	}
	/**
	 * Cierra la conexión, salvo que haya una transacción abierta
	 */
	private function release() {
		if (!$this->inTransaction && $this->link) {
			$this->link->close();
			$this->link = null;
		}
	}
	/**
	 * Manejo de errores: dentro de una transacción se relanza la excepción
	 * para que el modelo pueda hacer rollback; fuera de ella se responde el error.
	 */
	private function fail($e) {
		if ($this->inTransaction) {
			throw $e;
		}
		handleException($e);
	}
	/**
	 * Transacciones: todas las sentencias entre begin y commit/rollback
	 * se ejecutan sobre la misma conexión.
	 */
	public function beginTransaction() {
		$this->inTransaction = false;
		$this->connect();
		$this->link->begin_transaction();
		$this->inTransaction = true;
	}
	public function commit() {
		if (!$this->link->commit()) {
			throw new Exception('No se pudo confirmar la transacción: ' . $this->link->error);
		}
		$this->inTransaction = false;
		$this->release();
	}
	public function rollback() {
		if ($this->link) {
			$this->link->rollback();
		}
		$this->inTransaction = false;
		$this->release();
	}
	/**
	 * Ejecutar una setencia SQL tipo SELECT
	 * @param $sql - string sentencia SQL
	 * @param $resultType - tipo de formato del resultado (obj,asoc,num)
	 * @return $resultType
	 */
	//
	public function executeSQL($sql,$resultType="obj") {
		
		$lista = []; // lista vacía en lugar de NULL cuando no hay filas
		try {
			$this->connect();	
			if ($result = $this->link->query ( $sql )) {
				for ($num_fila = 0; $num_fila < $result->num_rows; $num_fila++) { // respeta el ORDER BY de la consulta
					$result->data_seek ( $num_fila );
					switch ($resultType){
						case "obj":
							$lista [] = mysqli_fetch_object ( $result );
							break;
						case "asoc":
							$lista [] = mysqli_fetch_assoc( $result );
							break;
						case "num":
							$lista [] = mysqli_fetch_row( $result );
							break;
						default:
							$lista [] = mysqli_fetch_object ( $result );
							break;
					}
					
					
				}

			} 
			
			
			else {
				throw new \Exception('Error: Falló la ejecución de la sentencia'.$this->link->errno.' '.$this->link->error);
			}
			$this->release();
			return $lista;
		} catch ( Exception $e ) {
			$this->fail($e);
		}
	}
	/**
	 * Ejecutar una setencia SQL tipo INSERT,UPDATE
	 * @param $sql - string sentencia SQL
	 * @return $num_result - numero de resultados de la ejecución
	 */
	//
	public function executeSQL_DML($sql) {
		$num_results = 0;
		$lista = NULL;
		try {
			$this->connect();
			if ($result = $this->link->query ( $sql )) {
				$num_results = mysqli_affected_rows ( $this->link );
			}
			$this->release();
			return $num_results;
		} catch ( Exception $e ) {
			$this->fail($e);
		}
	}
	/**
	 * Ejecutar una setencia SQL tipo INSERT,UPDATE
	 * @param $sql - string sentencia SQL
	 * @return $num_result- último id insertado
	 */
	//
	public function executeSQL_DML_last($sql) {
		$num_results = 0;
		$lista = NULL;
		try {
			$this->connect();
			if ($result = $this->link->query ( $sql )) {
				$num_results =$this->link->insert_id;
				
			}
			
			$this->release();
			return $num_results;
		} catch ( Exception $e ) {
			$this->fail($e);
		}
	}

	/**
	 * Consulta con sentencia preparada. Devuelve un arreglo de objetos.
	 */
	public function consultar($sql, array $params = []) {
		try {
			$this->connect();
			$stmt = $this->preparar($sql, $params);
			$stmt->execute();
			$resultado = $stmt->get_result();
			$filas = [];
			while ($fila = $resultado->fetch_object()) {
				$filas[] = $fila;
			}
			$stmt->close();
			$this->release();
			return $filas;
		} catch (Exception $e) {
			$this->fail($e);
		}
	}
	/**
	 * Devuelve la primera fila de una consulta preparada, o null.
	 */
	public function consultarUno($sql, array $params = []) {
		$filas = $this->consultar($sql, $params);
		return $filas[0] ?? null;
	}
	/**
	 * INSERT / UPDATE / DELETE con sentencia preparada.
	 * Devuelve ['filas' => filas afectadas, 'id' => último id insertado].
	 */
	public function ejecutar($sql, array $params = []) {
		try {
			$this->connect();
			$stmt = $this->preparar($sql, $params);
			$stmt->execute();
			$res = ['filas' => $stmt->affected_rows, 'id' => $this->link->insert_id];
			// Consumir todos los resultados de un CALL antes del COMMIT
			while ($stmt->more_results() && $stmt->next_result()) {
				if ($r = $stmt->get_result()) {
					$r->free();
				}
			}
			$stmt->close();
			$this->release();
			return $res;
		} catch (Exception $e) {
			$this->fail($e);
		}
	}
	private function preparar($sql, array $params) {
		$stmt = $this->link->prepare($sql);
		if ($params) {
			$tipos = '';
			foreach ($params as $p) {
				$tipos .= is_int($p) ? 'i' : (is_float($p) ? 'd' : 's');
			}
			$stmt->bind_param($tipos, ...$params);
		}
		return $stmt;
	}
}
