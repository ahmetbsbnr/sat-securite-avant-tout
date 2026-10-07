<?php
class MyConnexion
{
	private static $instance = null;
	private $connexion;
	private $server;
	private $username;
	private $password;

	private function __construct($host, $port, $bdname, $user, $pwd, $charset='utf8', $driver='mysql' )
	{
	try
		{
			$dsn = $driver.":host=" .$host .";port=" .$port .";dbname=" .$bdname .";charset=" .$charset;
			$this->connexion = new PDO ($dsn, $user, $pwd);
		}
    catch (PDOException $e)
        {
			throw new RuntimeException("Problème connexion à la base de données !");
        }
	}

	public static function getInstance($host, $port, $bdname, $user, $pwd, $charset='utf8', $driver='mysql')
	{
	if (self::$instance == null)
		{
			self::$instance = new MyConnexion($host, $port, $bdname, $user, $pwd, $charset, $driver);
		}

		return self::$instance;
	}

	public function prepare ($sql, $options=NULL)
	{
		$statement = $this->connexion->prepare($sql);
		if (strpos(strtoupper($sql),'SELECT') === 0)
		{
			$statement->fetch(PDO::FETCH_ASSOC);
		}
		return $statement;
	}
}

?>
