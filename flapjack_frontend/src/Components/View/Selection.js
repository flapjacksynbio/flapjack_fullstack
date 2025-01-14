import React from 'react'
import PropTypes from 'prop-types'
import { useLocation, useHistory } from 'react-router-dom'
import { Collapse, Button, Layout, message, Form } from 'antd'
import ProviderSelection from './ProviderSelection'
import PlotOptions from './PlotOptions'
import AnalysisSelection from './AnalysisSelection'
import api from '../../api'
import _ from 'lodash'

/** Renders the query form for plot creation */
const Selection = ({ onSubmit }) => {
  const location = useLocation()
  const history = useHistory()
  
  // Query
  const [selectedStudies, setSelectedStudies] = React.useState([])
  const [selectedAssays, setSelectedAssays] = React.useState([])
  const [selectedVectors, setSelectedVectors] = React.useState([])
  const [selectedMedia, setSelectedMedia] = React.useState([])
  const [selectedStrain, setSelectedStrain] = React.useState([])
  const [selectedSignals, setSelectedSignals] = React.useState([])

  const [analysisForm] = Form.useForm()

  // Set initial values based on url query parameters
  React.useEffect(() => {
    const queryString = window.location.search;
    if (queryString) {
      const urlParams = new URLSearchParams(queryString);
      const study_id = parseInt(urlParams.get('study'));
      const assay_id = parseInt(urlParams.get('assay'));
      const vector_id = parseInt(urlParams.get('vector'));
      const media_id = parseInt(urlParams.get('media'));
      const strain_id = parseInt(urlParams.get('strain'));
      const signal_id = parseInt(urlParams.get('signal'));

      if (study_id) {
        api
          .get('study', null, { id: study_id })
          .then(({ results }) =>
          results.forEach(({ id, name }) => setSelectedStudies([{ id: +id, name }])),
        )
        .catch(() => null)
      }
      if (assay_id) {
        api
          .get('assay', null, { id: assay_id })
          .then(({ results }) =>
          results.forEach(({ id, name }) => setSelectedAssays([{ id: +id, name }])),
        )
        .catch(() => null)
      }
      if (vector_id) {
        api
          .get('vector', null, { id: vector_id })
          .then(({ results }) =>
          results.forEach(({ id, name }) => setSelectedVectors([{ id: +id, name }])),
        )
        .catch(() => null)
      }
      if (media_id) {
        api
          .get('media', null, { id: media_id })
          .then(({ results }) =>
          results.forEach(({ id, name }) => setSelectedMedia([{ id: +id, name }])),
        )
        .catch(() => null)
      }
      if (strain_id) {
        api
          .get('strain', null, { id: strain_id })
          .then(({ results }) =>
          results.forEach(({ id, name }) => setSelectedStrain([{ id: +id, name }])),
        )
        .catch(() => null)
      }
      if (signal_id) {
        api
          .get('signal', null, { id: signal_id })
          .then(({ results }) =>
          results.forEach(({ id, name }) => setSelectedSignals([{ id: +id, name }])),
        )
        .catch(() => null)
      }
      history.replace({
        pathname: location.pathname,
        state: null,
      })
    }
    if (location.state) {
      const { study, assay, vector, media, strain, signal } = location.state
      if (study) setSelectedStudies([study])
      if (assay) setSelectedAssays([assay])
      if (vector) setSelectedVectors([vector])
      if (media) setSelectedMedia([media])
      if (strain) setSelectedStrain([strain])
      if (signal) setSelectedSignals([signal])
      history.replace({
        pathname: location.pathname,
        state: null,
      })
    }
  }, [location, history])

  const addSelected = (value, checked, setSelected) => {
    if (checked) {
      setSelected((selected) => [...selected.filter(({ id }) => id !== value.id), value])
    } else {
      setSelected((selected) => selected.filter(({ id }) => id !== value.id))
    }
  }

  // Select a study an all related assays
  const setStudiesAndChildAssays = async (value, checked) => {
    addSelected(value, checked, setSelectedStudies)
    if (!checked) return

    api
      .get('assay', null, { study: value.id })
      .then(({ results }) =>
        results.forEach(({ id, name }) => setAssaysAndChildren({ id: +id, name }, true)),
      )
      .catch(() => null)
  }

  const url_to_setter = {
    vector_in_assay: setSelectedVectors,
    strain_in_assay: setSelectedStrain,
    media_in_assay: setSelectedMedia,
    signal_in_assay: setSelectedSignals,
  }

  // Set an assay and all related vectors, strains, media and signals
  const setAssaysAndChildren = async (value, checked) => {
    addSelected(value, checked, setSelectedAssays)
    if (!checked) return

    Object.entries(url_to_setter).forEach(([url, setter]) => {
      api
        .get(url, null, { id: value.id })
        .then(({ results }) =>
          results.reduce((acc, { id, name }) => ({ ...acc, [id]: { id, name } }), {}),
        )
        .then((res) =>
          setter((selected) => [
            ...selected.filter(({ id }) => !res[id]),
            ...Object.values(res),
          ]),
        )
        .catch(() => null)
    })
  }

  const queryFields = [
    {
      url: 'study',
      label: 'studies',
      header: 'Studies',
      selected: selectedStudies,
      _selectedSetter: setSelectedStudies,
      setSelected: setStudiesAndChildAssays,
    },
    {
      url: 'assay',
      label: 'assays',
      header: 'Assays',
      selected: selectedAssays,
      _selectedSetter: setSelectedAssays,
      setSelected: setAssaysAndChildren,
    },
    {
      url: 'vector',
      label: 'Vectors',
      header: 'Vector',
      selected: selectedVectors,
      _selectedSetter: setSelectedVectors,
      setSelected: (value, checked) => addSelected(value, checked, setSelectedVectors),
    },
    {
      url: 'strain',
      label: 'Strains',
      header: 'Strain',
      selected: selectedStrain,
      _selectedSetter: setSelectedStrain,
      setSelected: (value, checked) => addSelected(value, checked, setSelectedStrain),
    },
    {
      url: 'media',
      label: 'Media',
      header: 'Media',
      selected: selectedMedia,
      _selectedSetter: setSelectedMedia,
      setSelected: (value, checked) => addSelected(value, checked, setSelectedMedia),
    },
    {
      url: 'signal',
      label: 'Signal',
      header: 'Signal',
      selected: selectedSignals,
      _selectedSetter: setSelectedSignals,
      setSelected: (value, checked) => addSelected(value, checked, setSelectedSignals),
    },
  ]

  // Plot Options
  const [normalize, setNormalize] = React.useState('None')
  const [subplots, setSubplots] = React.useState('Signal')
  const [markers, setMarkers] = React.useState('Vector')
  const [plot, setPlot] = React.useState('Mean +/- std')

  const plotOptionsFields = [
    {
      name: 'Normalize',
      options: ['Temporal Mean', 'Mean/std', 'Min/Max', 'None'],
      selected: normalize,
      setSelected: setNormalize,
      defaultValue: 'None',
    },
    {
      name: 'Subplots',
      options: ['Study', 'Assay', 'Vector', 'Media', 'Strain', 'Supplement', 'Signal'],
      selected: subplots,
      setSelected: setSubplots,
      defaultValue: 'Signal',
    },
    {
      name: 'Lines/Markers',
      options: ['Study', 'Assay', 'Vector', 'Media', 'Strain', 'Supplement', 'Signal'],
      selected: markers,
      setSelected: setMarkers,
      defaultValue: 'Vector',
    },
    {
      name: 'Plot',
      options: ['Mean', 'Mean +/- std', 'All data points'],
      selected: plot,
      setSelected: setPlot,
      defaultValue: 'Mean +/- std',
    },
  ]

  const renderClear = (selected, setter) => (
    <Button
      disabled={!selected.length}
      onClick={(e) => {
        e.stopPropagation()
        setter([])
      }}
      size="small"
      type="danger"
    >
      Clear
    </Button>
  )

  const onPlot = async () => {
    let form = {
      study: selectedStudies.map(({ id }) => id),
      assay: selectedAssays.map(({ id }) => id),
      vector: selectedVectors.map(({ id }) => id),
      strain: selectedStrain.map(({ id }) => id),
      media: selectedMedia.map(({ id }) => id),
      signal: selectedSignals.map(({ id }) => id),
    }

    if (!Object.values(form).some((val) => val.length)) {
      message.warn('Please select data to plot.')
      return
    }

    form.plotOptions = { normalize, subplots, markers, plot }

    const analysisValues = await analysisForm
      .validateFields()
      .then((values) => {
        return Object.entries(values).reduce((acc, [key, value]) => {
          if (_.isPlainObject(value) && value.value) {
            return { ...acc, [key]: value.value }
          }
          return { ...acc, [key]: value }
        }, {})
      })
      .catch((e) => {
        console.log(e)
        message.warn('Please fill the fields in the analysis form.')
      })

    if (analysisValues && analysisValues.type !== 'None') form.analysis = analysisValues

    onSubmit(form)
  }

  return (
    <Layout>
      <Layout.Content>
        <Collapse defaultActiveKey={['1']}>
          <Collapse.Panel header="Query" key="1">
            <Collapse>
              {queryFields.map((field) => (
                <Collapse.Panel
                  key={field.label}
                  header={field.header}
                  extra={renderClear(field.selected, field._selectedSetter)}
                >
                  <ProviderSelection {...field} />
                </Collapse.Panel>
              ))}
            </Collapse>
          </Collapse.Panel>
          <Collapse.Panel header="Analysis" key="2" forceRender>
            <AnalysisSelection formInstance={analysisForm} />
          </Collapse.Panel>
          <Collapse.Panel header="Plot Options" key="3">
            <PlotOptions fields={plotOptionsFields} />
          </Collapse.Panel>
        </Collapse>
      </Layout.Content>
      <Layout.Footer style={{ padding: 0 }}>
        <Button type="primary" onClick={onPlot} block>
          Plot
        </Button>
      </Layout.Footer>
    </Layout>
  )
}

Selection.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default Selection
