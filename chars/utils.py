from django.conf import settings
import base64
import boto3


class StorageHandler():
    @classmethod
    def base64_to_s3(cls, data, path, filename):
        if "base64," in data:
            data = data.replace("data:image/png;base64,", "")
        data = base64.b64decode(data)

        s3 = cls.get_s3_resource()
        return s3.Object(settings.AWS_STORAGE_BUCKET_NAME, path + filename).put(Body=data)

    @classmethod
    def rename_object(cls, old_path, new_path):
        s3 = cls.get_s3_resource()
        print("copying", old_path, "to", new_path)
        s3.Object(settings.AWS_STORAGE_BUCKET_NAME, new_path).copy_from(
            CopySource=settings.AWS_STORAGE_BUCKET_NAME + "/" + old_path)
        print("deleting", old_path)
        s3.Object(settings.AWS_STORAGE_BUCKET_NAME, old_path).delete()

    @classmethod
    def delete_object(cls, path):
        s3 = cls.get_s3_resource()
        s3.Object(settings.AWS_STORAGE_BUCKET_NAME, path).delete()

    @classmethod
    def get_s3_resource(cls):
        return boto3.resource(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )
