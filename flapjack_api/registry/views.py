from django.db.models import Q
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from rest_framework_filters import FilterSet, CharFilter, NumberFilter, RelatedFilter, BooleanFilter
from rest_framework_filters.backends import RestFrameworkFilterBackend
from .models import *
from .serializers import *
from .permissions import *
import django_filters


# FilterSets

class StudyFilter(FilterSet):
    name = CharFilter(lookup_expr='exact')
    doi = CharFilter(lookup_expr='exact')
    sboluri = CharFilter(lookup_expr='icontains')
    is_owner = BooleanFilter(field_name='owner', method='filter_is_owner')

    class Meta:
        model = Study
        fields = ('id',)

    def filter_is_owner(self, qs, name, value):
        user = self.request.user
        return Study.objects.filter(owner=user)


class AssayFilter(FilterSet):
    name = CharFilter(lookup_expr='exact')
    machine = CharFilter(lookup_expr='icontains')
    description = CharFilter(lookup_expr='icontains')
    sboluri = CharFilter(lookup_expr='icontains')

    class Meta:
        model = Assay
        fields = ('id', 'study', 'temperature')


class MediaFilter(FilterSet):
    name = CharFilter(lookup_expr='exact')
    description = CharFilter(lookup_expr='icontains')
    sboluri = CharFilter(lookup_expr='icontains')

    class Meta:
        model = Media
        fields = ('id',)


class StrainFilter(FilterSet):
    name = CharFilter(lookup_expr='exact')
    description = CharFilter(lookup_expr='icontains')
    sboluri = CharFilter(lookup_expr='icontains')

    class Meta:
        model = Strain
        fields = ('id',)


class ChemicalFilter(FilterSet):
    name = CharFilter(lookup_expr='exact')
    description = CharFilter(lookup_expr='icontains')
    pubchemid = NumberFilter(lookup_expr='exact')
    sboluri = CharFilter(lookup_expr='icontains')

    class Meta:
        model = Chemical
        fields = ('id',)


class SupplementFilter(FilterSet):
    name = CharFilter(lookup_expr='exact')
    concentration = NumberFilter(lookup_expr='exact')
    sboluri = CharFilter(lookup_expr='icontains')

    class Meta:
        model = Supplement
        fields = ('id', 'chemical')


class DnaFilter(FilterSet):
    name = CharFilter(lookup_expr='exact')
    sboluri = CharFilter(lookup_expr='icontains')

    class Meta:
        model = Dna
        fields = ('id',)


class VectorFilter(FilterSet):
    name = CharFilter(lookup_expr='exact')  
    dnas = RelatedFilter(DnaFilter, field_name='dnas',
                        queryset=Dna.objects.all())
    sboluri = CharFilter(lookup_expr='icontains')
    
    class Meta:
        model = Vector
        fields = ('id',)


class SampleFilter(FilterSet):
    sboluri = CharFilter(lookup_expr='icontains')
    
    class Meta:
        model = Sample
        fields = (
                'id', 
                'assay', 
                'media', 
                'strain', 
                'vector', 
                'supplements', 
                'row', 
                'col',
                'sboluri'
        )


class SignalFilter(FilterSet):
    name = CharFilter(lookup_expr='exact')
    description = CharFilter(lookup_expr='icontains')
    color = CharFilter(lookup_expr='icontains')
    sboluri = CharFilter(lookup_expr='icontains')

    class Meta:
        model = Signal
        fields = ('id',)


class MeasurementFilter(FilterSet):
    class Meta:
        model = Measurement
        fields = ('id', 'sample', 'signal', 'value')

class UserFilter(FilterSet):
    username = CharFilter(lookup_expr='icontains')
    email = CharFilter(lookup_expr='icontains')

    class Meta:
        model = User
        fields = ('id',)


# ViewSets

class StudyViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows studies to be viewed or edited.
    """
    permission_classes = [StudyPermission]
    queryset = Study.objects.all()
    serializer_class = StudySerializer
    filter_backends = [SearchFilter, RestFrameworkFilterBackend]
    filterset_class = StudyFilter
    search_fields = ['name',  'description', 'doi', 'sboluri']
    
    def get_queryset(self):
        user = self.request.user
        return Study.objects.filter(
            Q(owner=user) | 
            Q(public=True) | 
            Q(shared_with=user)
        ).distinct()
    

class AssayViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows assays to be viewed or edited.
    """
    permission_classes = [AssayPermission]
    queryset = Assay.objects.all()
    serializer_class = AssaySerializer
    filter_backends = [SearchFilter, RestFrameworkFilterBackend]
    filterset_class = AssayFilter
    search_fields = [
        'name',
        'machine',
        'description',
        'study__name',
        'study__description',
        'sboluri'
    ]

    def get_queryset(self):
        user = self.request.user
        return Assay.objects.filter(
            Q(study__owner=user) |
            Q(study__public=True) |
            Q(study__shared_with=user)
        ).distinct()


class MediaViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows media to be viewed or edited.
    """
    permission_classes = [MediaPermission]
    queryset = Media.objects.all()
    serializer_class = MediaSerializer
    filter_backends = [SearchFilter, RestFrameworkFilterBackend]
    filter_class = MediaFilter
    search_fields = ['name', 'description', 'sboluri']


class StrainViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows strain to be viewed or edited.
    """
    permission_classes = [StrainPermission]
    queryset = Strain.objects.all()
    serializer_class = StrainSerializer
    filter_class = StrainFilter
    filter_backends = [SearchFilter, RestFrameworkFilterBackend]
    search_fields = ['name', 'description', 'sboluri']


class ChemicalViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows chemical to be viewed or edited.
    """
    permission_classes = [ChemicalPermission]
    queryset = Chemical.objects.all()
    serializer_class = ChemicalSerializer
    filter_class = ChemicalFilter
    filter_backends = [SearchFilter, RestFrameworkFilterBackend]
    search_fields = ['name', 'description', 'sboluri']


class SupplementViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows supplement to be viewed or edited.
    """
    permission_classes = [SupplementPermission]
    queryset = Supplement.objects.all()
    serializer_class = SupplementSerializer
    filter_class = SupplementFilter
    filter_backends = [SearchFilter, RestFrameworkFilterBackend]
    search_fields = ['name', 'sboluri']


class DnaViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows dnas to be viewed or edited.
    """
    permission_classes = [DnaPermission]
    queryset = Dna.objects.all()
    serializer_class = DnaSerializer
    filterset_class = DnaFilter
    filter_backends = [SearchFilter, RestFrameworkFilterBackend]
    search_fields = [
        'name',
        'sboluri'
    ]

    def get_queryset(self):
        user = self.request.user
        return Dna.objects.filter(
            Q(owner=user) |
            Q(vectors__sample__assay__study__public=True) |
            Q(vectors__sample__assay__study__shared_with=user)  |
            Q(vectors__sample__assay__study__owner=user)
        ).distinct()


class VectorAllViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows vector to be viewed or edited.
    """
    permission_classes = [VectorPermission]
    queryset = Vector.objects.all()
    serializer_class = VectorAllSerializer
    filter_class = VectorFilter
    filter_backends = [SearchFilter, RestFrameworkFilterBackend]
    search_fields = ['name', 'sboluri']

    def get_queryset(self):
        user = self.request.user
        return Vector.objects.filter(
            Q(owner=user) |
            Q(sample__assay__study__public=True) |
            Q(sample__assay__study__shared_with=user) |
            Q(sample__assay__study__owner=user)
        ).distinct()


class VectorViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows vector to be viewed or edited.
    """
    permission_classes = [VectorPermission]
    queryset = Vector.objects.all()
    serializer_class = VectorSerializer
    filter_class = VectorFilter
    filter_backends = [SearchFilter, RestFrameworkFilterBackend]
    search_fields = ['name', 'sboluri']

    def get_queryset(self):
        user = self.request.user
        return Vector.objects.filter(
            Q(owner=user) |
            Q(sample__assay__study__public=True) |
            Q(sample__assay__study__shared_with=user) |
            Q(sample__assay__study__owner=user)
        ).distinct()


class SampleViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows samples to be viewed or edited.
    """
    permission_classes = [SamplePermission]
    queryset = Sample.objects.all()
    filter_backends = [SearchFilter, RestFrameworkFilterBackend]
    filter_class = SampleFilter
    search_fields = [
        'assay__name',
        'media__name',
        'strain__name',
        'assay__description',
        'assay__study__name',
        'assay__study__description',
        'vector__name',
        'sboluri'
    ]

    def get_serializer_class(self):
        if self.action == 'create':
            return SampleSerializerCreate
        else:
            return SampleSerializer

    def get_queryset(self):
        user = self.request.user
        return Sample.objects.filter(
            Q(assay__study__owner=user) |
            Q(assay__study__public=True) |
            Q(assay__study__shared_with=user)
        ).distinct()


class SignalViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows signals to be viewed or edited.
    """
    permission_classes = [SignalPermission]
    queryset = Signal.objects.all()
    serializer_class = SignalSerializer
    filter_class = SignalFilter
    filter_backends = [SearchFilter, RestFrameworkFilterBackend]
    search_fields = ['name', 'description', 'color', 'sboluri']


class MeasurementViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows measurements to be viewed or edited.
    """
    permission_classes = [MeasurementPermission]
    queryset = Measurement.objects.all()
    serializer_class = MeasurementSerializer
    filter_class = MeasurementFilter
    filter_backends = [SearchFilter, RestFrameworkFilterBackend]
    search_fields = [
        'signal__name', 
        'sample__assay__name', 
        'sample__assay__study__name']

    def get_queryset(self):
        user = self.request.user
        return Measurement.objects.filter(
            Q(sample__assay__study__owner=user) |
            Q(sample__assay__study__public=True) |
            Q(sample__assay__study__shared_with=user)
        ).distinct()


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = [UserPermission]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_class = UserFilter
    filter_backends = [SearchFilter, RestFrameworkFilterBackend]
    filterset_fields = ['username']
    search_fields = ['username']


class AssaysInStudy(viewsets.ModelViewSet):
    """
    API endpoint that returns the objects related with a study
    """
    serializer_class = AssaySerializer
    queryset = Assay.objects.all()
    def get_queryset(self):
        s_id = int(self.request.query_params['id'])
        return Study.objects.get(id=s_id).assay_set.all()


class VectorInAssay(viewsets.ModelViewSet):
    """
    API endpoint that returns the objects related with a study
    """
    serializer_class = VectorSerializer
    queryset = Vector.objects.all()
    def get_queryset(self):
        a_id = int(self.request.query_params['id'])
        samples = Assay.objects.get(id=a_id).sample_set.all()
        return Vector.objects.filter(sample__in=samples).distinct()


class StrainInAssay(viewsets.ModelViewSet):
    """
    API endpoint that returns the objects related with a study
    """
    serializer_class = StrainSerializer
    queryset = Strain.objects.all()
    def get_queryset(self):
        s_id = int(self.request.query_params['id'])
        samples = Assay.objects.get(id=s_id).sample_set.all()
        return Strain.objects.filter(sample__in=samples).distinct()


class MediaInAssay(viewsets.ModelViewSet):
    """
    API endpoint that returns the objects related with a study
    """
    serializer_class = MediaSerializer
    queryset = Media.objects.all()
    def get_queryset(self):
        m_id = int(self.request.query_params['id'])
        samples = Assay.objects.get(id=m_id).sample_set.all()
        return Media.objects.filter(sample__in=samples).distinct()


class SignalInAssay(viewsets.ModelViewSet):
    """
    API endpoint that returns the objects related with a study
    """
    serializer_class = SignalSerializer
    queryset = Signal.objects.all()
    def get_queryset(self):
        s_id = int(self.request.query_params['id'])
        samples = Assay.objects.get(id=s_id).sample_set.all()
        meas = Measurement.objects.filter(sample__in=samples)
        return Signal.objects.filter(measurement__in=meas).distinct()