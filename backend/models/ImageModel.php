<?php
class ImageModel
{
    private $upload_path = 'uploads/';
    private $valid_extensions = array('jpeg', 'jpg', 'png', 'gif');

    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    //Subir imagen de una pelicula registrada
    public function uploadFile($object) {
        try {
            $file = $object['file'];
            $Id_crucero = (int) $object['Id_Crucero'];
            
            $fileName = $file['name'];
            $tempPath = $file['tmp_name'];
            $fileSize = $file['size'];
            $fileError = $file['error'];
    
            if (!empty($fileName)) {
                $fileExt = explode('.', $fileName);
                $fileActExt = strtolower(end($fileExt));
                $fileName = "crucero-" . uniqid() . "." . $fileActExt;
    
                if (in_array($fileActExt, $this->valid_extensions)) {
                    if (!file_exists($this->upload_path . $fileName)) {
                        if ($fileSize < 20000000000 && $fileError == 0) {
                            if (move_uploaded_file($tempPath, $this->upload_path . $fileName)) {
                                $sql = "UPDATE crucero SET Foto = '$fileName' WHERE Id = $Id_crucero";
                                $this->enlace->executeSQL_DML($sql);
                                return ['Foto' => $fileName];
                            }
                        }
                    }
                }
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Obtener una imagen de una pelicula
    
}
