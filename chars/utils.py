from django.conf import settings
from django.apps import apps
import base64
import boto3


class StorageHandler:
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


class CSVFileReader:
    @staticmethod
    def read(file):
        file.seek(0)
        data = []
        for line in file.readlines():
            data.append(line.decode('utf-8'))

        return data


class LocationSourceMapper:
    @staticmethod
    def map(locations=None, source=None):
        Char = apps.get_model('chars', 'Char')
        CharInSource = apps.get_model('chars', 'CharInSource')

        to_be_added = []
        for item in locations:
            data = item.split(',')
            name = data[0]
            if len(name) > 1:
                continue  # any faulty characters
            page = data[1].split('\n')[0]

            char, c_created = Char.objects.get_or_create(
                name=name,
            )

            location, l_created = CharInSource.objects.get_or_create(
                source=source,
                page=page,
                char=char
            )

            if l_created or c_created:
                to_be_added.append({
                    'source': location.source,
                    'location': location.page,
                    'char': char
                })

        return to_be_added
