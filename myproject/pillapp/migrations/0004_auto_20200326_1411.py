# Generated by Django 3.0.4 on 2020-03-26 18:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pillapp', '0003_auto_20200326_1245'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='patient',
            name='patient_phone',
        ),
        migrations.AddField(
            model_name='patient',
            name='patient_email',
            field=models.CharField(default='myfatemi04@gmail.com', max_length=320),
            preserve_default=False,
        ),
    ]
