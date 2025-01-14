from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *


class StudySerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())
    is_owner = serializers.SerializerMethodField()
    shared_with = serializers.SlugRelatedField(
        many=True,
        slug_field='email',
        queryset=User.objects.all(),
        required=False
    )

    class Meta:
        model = Study
        fields = '__all__'

    def get_is_owner(self, obj):
       return self.context['request'].user.id == obj.owner.id


class AssaySerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Assay
        fields = '__all__'


class MediaSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Media
        fields = '__all__'


class StrainSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Strain
        fields = '__all__'


class ChemicalSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Chemical
        fields = '__all__'


class SupplementSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Supplement
        fields = '__all__'


class DnaSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Dna
        fields = '__all__'


class VectorAllSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    dnas = DnaSerializer(many=True)
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Vector
        fields = '__all__'
        
class VectorSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Vector
        fields = '__all__'#['id', 'name', 'dnas']


class SampleSerializerCreate(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Sample
        fields = ['id', 'assay', 'media', 'strain', 'row', 'col', 'vector']

class SampleSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Sample
        fields = '__all__'


class SignalSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Signal
        fields = '__all__'

    def to_internal_value(self, data):
        validated = {
                'id': data.get('id'),
                'name': data.get('name'),
                'description': data.get('description'),
                'color': data.get('color').lower(),
                'owner_id': self.context['request'].user.id,
                }
        return validated
        

class MeasurementSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Measurement
        fields = '__all__'
        '''
        fields = (
            'id', 'signal', 'value', 'time', 'sample',
            'study',
            'assay',
            'dna',
            'media',
            'strain',
            'inducer'
        )
        '''
class UserSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = User
        fields = '__all__'
    
    '''
    def get_study(self, obj):
        return obj.sample.assay.study.name
    def get_assay(self, obj):
        return obj.sample.assay.name
    def get_dna(self, obj):
        return obj.sample.dna.names
    def get_media(self, obj):
        return obj.sample.media.name
    def get_strain(self, obj):
        return obj.sample.strain.name
    def get_inducer(self, obj):
        return obj.sample.inducer.names
    '''


'''
class GroupSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = Group
        fields = '__all__'

class UserProfileInfoSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = UserProfileInfo
        fields = '__all__'
'''
